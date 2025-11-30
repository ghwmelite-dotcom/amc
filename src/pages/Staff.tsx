import React, { useState, useMemo } from 'react';
import { Search, Plus, Grid, List, Mail, Phone, Award } from 'lucide-react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { useAppStore } from '../stores/appStore';
import { formatDate } from '../utils/formatters';

const Staff: React.FC = () => {
  const { staff, openModal, activeModal, closeModal, modalData, addToast } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const departments = useMemo(() => {
    const depts = new Set(staff.map((s) => s.department));
    return ['all', ...Array.from(depts)];
  }, [staff]);

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = filterDepartment === 'all' || s.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [staff, searchQuery, filterDepartment, filterStatus]);

  const handleAddStaff = () => {
    addToast('Staff member added successfully', 'success');
    closeModal();
  };

  const selectedStaff = modalData as typeof staff[0] | null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-11 w-80"
            />
          </div>

          {/* Filters */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="input-field w-48"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="off-duty">Off Duty</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/50'
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/50'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={() => openModal('add-staff')} icon={<Plus className="w-4 h-4" />}>
            Add Staff
          </Button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-white/50 text-sm">
        Showing {filteredStaff.length} of {staff.length} staff members
      </p>

      {/* Staff Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-4 gap-5">
          {filteredStaff.map((member, i) => (
            <Card3D
              key={member.id}
              intensity={15}
              onClick={() => openModal('staff-detail', member)}
              className="glass-card p-7 cursor-pointer opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar
                    name={member.name}
                    initials={member.avatar}
                    type={member.type}
                    size="xl"
                    status={member.status}
                    showStatus
                  />
                </div>
                <h3 className="font-semibold text-base mb-1">{member.name}</h3>
                <p className="text-sm text-white/50 mb-3">{member.role}</p>
                <Badge variant="default">{member.department}</Badge>
              </div>
            </Card3D>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStaff.map((member, i) => (
            <Card3D
              key={member.id}
              intensity={8}
              onClick={() => openModal('staff-detail', member)}
              className="glass-card p-5 cursor-pointer flex items-center gap-5 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'forwards' }}
            >
              <Avatar
                name={member.name}
                initials={member.avatar}
                type={member.type}
                size="lg"
                status={member.status}
                showStatus
              />
              <div className="flex-1">
                <h3 className="font-semibold text-base">{member.name}</h3>
                <p className="text-sm text-white/50">{member.role}</p>
              </div>
              <Badge variant="default">{member.department}</Badge>
              <Badge
                variant={
                  member.status === 'active'
                    ? 'success'
                    : member.status === 'on-leave'
                      ? 'warning'
                      : 'default'
                }
              >
                {member.status}
              </Badge>
            </Card3D>
          ))}
        </div>
      )}

      {/* Staff Detail Modal */}
      <Modal
        isOpen={activeModal === 'staff-detail' && !!selectedStaff}
        onClose={closeModal}
        title="Staff Details"
        size="lg"
      >
        {selectedStaff && (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <Avatar
                name={selectedStaff.name}
                initials={selectedStaff.avatar}
                type={selectedStaff.type}
                size="xl"
                status={selectedStaff.status}
                showStatus
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{selectedStaff.name}</h3>
                <p className="text-white/60 mb-3">{selectedStaff.role}</p>
                <div className="flex gap-2">
                  <Badge variant="default">{selectedStaff.department}</Badge>
                  <Badge
                    variant={
                      selectedStaff.status === 'active'
                        ? 'success'
                        : selectedStaff.status === 'on-leave'
                          ? 'warning'
                          : 'default'
                    }
                  >
                    {selectedStaff.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl flex items-center gap-3">
                <Mail className="w-5 h-5 text-amc-teal" />
                <div>
                  <div className="text-xs text-white/50">Email</div>
                  <div className="text-sm">{selectedStaff.email}</div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl flex items-center gap-3">
                <Phone className="w-5 h-5 text-amc-blue" />
                <div>
                  <div className="text-xs text-white/50">Phone</div>
                  <div className="text-sm">{selectedStaff.phone}</div>
                </div>
              </div>
            </div>

            {selectedStaff.certifications.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-amc-purple" />
                  <span className="text-sm font-medium">Certifications</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedStaff.certifications.map((cert, i) => (
                    <Badge key={i} variant="info">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-white/40">
              Joined: {formatDate(selectedStaff.joinDate)}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
              <Button onClick={() => addToast('Edit feature coming soon', 'info')}>
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Staff Modal */}
      <Modal
        isOpen={activeModal === 'add-staff'}
        onClose={closeModal}
        title="Add New Staff"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddStaff();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Full Name</label>
              <input type="text" className="input-field" placeholder="Enter full name" required />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Role</label>
              <input type="text" className="input-field" placeholder="Enter role" required />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Department</label>
              <select className="input-field" required>
                <option value="">Select department</option>
                {departments.filter((d) => d !== 'all').map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Staff Type</label>
              <select className="input-field" required>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="tech">Technician</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Email</label>
              <input type="email" className="input-field" placeholder="email@amc.gh" required />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Phone</label>
              <input type="tel" className="input-field" placeholder="+233 XX XXX XXXX" required />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={closeModal} type="button">
              Cancel
            </Button>
            <Button type="submit">Add Staff</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Staff;
