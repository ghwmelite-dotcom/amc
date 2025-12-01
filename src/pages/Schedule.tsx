import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Filter, Users, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Avatar from '../components/common/Avatar';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useAppStore } from '../stores/appStore';
import { getShiftColor } from '../utils/formatters';
import { staffData, departmentData } from '../data/mockData';

const Schedule: React.FC = () => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // December 2025
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    shiftType: 'all',
    department: 'all',
  });
  const { soundEnabled, addToast, openModal, activeModal, closeModal } = useAppStore();
  const { playSound } = useSoundEffects();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    if (soundEnabled) playSound('click');
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    if (soundEnabled) playSound('click');
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Generate schedule data for demo
  const getShiftsForDay = (day: number) => {
    const shifts = [];
    if (day % 3 === 0) shifts.push({ type: 'morning', count: 8 });
    if (day % 2 === 0) shifts.push({ type: 'afternoon', count: 6 });
    if (day % 4 === 0) shifts.push({ type: 'night', count: 4 });
    return shifts;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={prevMonth}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  if (soundEnabled) playSound('click');
                  setViewMode(mode);
                }}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                  viewMode === mode
                    ? 'bg-gradient-to-r from-amc-teal to-amc-blue text-white'
                    : 'text-white/50 hover:text-white/70'
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters(true)}
          >
            Filter
            {(filters.shiftType !== 'all' || filters.department !== 'all') && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-amc-teal rounded-full">
                {(filters.shiftType !== 'all' ? 1 : 0) + (filters.department !== 'all' ? 1 : 0)}
              </span>
            )}
          </Button>

          <Button
            icon={<Download className="w-4 h-4" />}
            onClick={() => addToast('Schedule exported', 'success')}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Shift Legend */}
      <div className="flex gap-4">
        {(['morning', 'afternoon', 'night'] as const).map((shift) => {
          const colors = getShiftColor(shift);
          return (
            <div key={shift} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.text }}
              />
              <span className="text-sm text-white/60 capitalize">{shift}</span>
            </div>
          );
        })}
      </div>

      {/* Calendar Grid */}
      <Card3D intensity={5} className="glass-card p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center py-3 text-sm font-semibold text-white/50"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before the first of the month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[120px] opacity-30" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const shifts = getShiftsForDay(day);
            const today = isToday(day);

            return (
              <Card3D
                key={day}
                intensity={15}
                onClick={() => {
                  if (soundEnabled) playSound('click');
                  setSelectedDay(day);
                  openModal('day-detail');
                }}
                className={clsx(
                  'min-h-[120px] p-3 rounded-2xl cursor-pointer transition-all',
                  today
                    ? 'bg-gradient-to-br from-amc-teal/15 to-amc-blue/15 border border-amc-teal/30'
                    : 'bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04]'
                )}
              >
                <div
                  className={clsx(
                    'font-semibold mb-2',
                    today ? 'text-amc-teal' : 'text-white'
                  )}
                >
                  {day}
                </div>
                <div className="space-y-1">
                  {shifts.map((shift, idx) => {
                    const colors = getShiftColor(shift.type);
                    return (
                      <div
                        key={idx}
                        className="text-[10px] px-2 py-1 rounded-md truncate"
                        style={{
                          background: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        {shift.type === 'morning' && '☀️'}
                        {shift.type === 'afternoon' && '🌤'}
                        {shift.type === 'night' && '🌙'}
                        {' '}{shift.count} staff
                      </div>
                    );
                  })}
                </div>
              </Card3D>
            );
          })}
        </div>
      </Card3D>

      {/* Filter Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Schedule"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Shift Type
            </label>
            <select
              value={filters.shiftType}
              onChange={(e) => setFilters({ ...filters, shiftType: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
            >
              <option value="all">All Shifts</option>
              <option value="morning">Morning (06:00 - 14:00)</option>
              <option value="afternoon">Afternoon (14:00 - 22:00)</option>
              <option value="night">Night (22:00 - 06:00)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
            >
              <option value="all">All Departments</option>
              {departmentData.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setFilters({ shiftType: 'all', department: 'all' });
              }}
            >
              Clear Filters
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setShowFilters(false);
                addToast('Filters applied', 'success');
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>

      {/* Day Detail Modal */}
      <Modal
        isOpen={activeModal === 'day-detail' && selectedDay !== null}
        onClose={() => {
          closeModal();
          setSelectedDay(null);
        }}
        title={selectedDay ? `${monthNames[currentDate.getMonth()]} ${selectedDay}, ${currentDate.getFullYear()}` : 'Day Details'}
        size="lg"
      >
        {selectedDay && (
          <div className="space-y-6">
            {/* Day Summary */}
            <div className="grid grid-cols-3 gap-4">
              {getShiftsForDay(selectedDay).map((shift, idx) => {
                const colors = getShiftColor(shift.type);
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl"
                    style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">
                        {shift.type === 'morning' && '☀️'}
                        {shift.type === 'afternoon' && '🌤'}
                        {shift.type === 'night' && '🌙'}
                      </span>
                      <span className="font-medium capitalize" style={{ color: colors.text }}>
                        {shift.type}
                      </span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: colors.text }}>
                      {shift.count}
                    </div>
                    <div className="text-sm text-white/50">Staff Scheduled</div>
                  </div>
                );
              })}
              {getShiftsForDay(selectedDay).length === 0 && (
                <div className="col-span-3 text-center py-8 text-white/50">
                  No shifts scheduled for this day
                </div>
              )}
            </div>

            {/* Scheduled Staff List */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-amc-teal" />
                <h3 className="font-semibold">Scheduled Staff</h3>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {staffData.slice(0, 8).map((staff, idx) => {
                  const shiftTypes = ['morning', 'afternoon', 'night'] as const;
                  const assignedShift = shiftTypes[idx % 3];
                  const colors = getShiftColor(assignedShift);
                  return (
                    <div
                      key={staff.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={staff.name} type={staff.type} size="md" />
                        <div>
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-sm text-white/50">{staff.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs px-2 py-1 rounded-md"
                          style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                        >
                          {assignedShift === 'morning' && '☀️ 06:00-14:00'}
                          {assignedShift === 'afternoon' && '🌤 14:00-22:00'}
                          {assignedShift === 'night' && '🌙 22:00-06:00'}
                        </span>
                        <Badge variant={staff.status === 'active' ? 'success' : 'warning'}>
                          {staff.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button
                variant="secondary"
                className="flex-1"
                icon={<Clock className="w-4 h-4" />}
                onClick={() => {
                  addToast('Opening shift editor...', 'info');
                }}
              >
                Edit Shifts
              </Button>
              <Button
                className="flex-1"
                icon={<Download className="w-4 h-4" />}
                onClick={() => {
                  addToast('Day schedule exported', 'success');
                }}
              >
                Export Day
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Shift Summary */}
      <div className="grid grid-cols-3 gap-6">
        {(['morning', 'afternoon', 'night'] as const).map((shift) => {
          const colors = getShiftColor(shift);
          const times = {
            morning: '06:00 - 14:00',
            afternoon: '14:00 - 22:00',
            night: '22:00 - 06:00',
          };
          return (
            <Card3D key={shift} intensity={10} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                >
                  {shift === 'morning' && '☀️'}
                  {shift === 'afternoon' && '🌤'}
                  {shift === 'night' && '🌙'}
                </div>
                <div>
                  <div className="font-semibold capitalize">{shift} Shift</div>
                  <div className="text-sm text-white/50">{times[shift]}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold" style={{ color: colors.text }}>
                    {shift === 'morning' ? 45 : shift === 'afternoon' ? 38 : 22}
                  </div>
                  <div className="text-xs text-white/50">Scheduled</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amc-green">
                    {shift === 'morning' ? '94%' : shift === 'afternoon' ? '89%' : '78%'}
                  </div>
                  <div className="text-xs text-white/50">Coverage</div>
                </div>
              </div>
            </Card3D>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
