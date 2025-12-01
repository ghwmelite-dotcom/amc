import React, { useState, useMemo } from 'react';
import { Calendar, Check, X, Clock, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import { useAppStore } from '../stores/appStore';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/formatters';
import { LEAVE_TYPES } from '../utils/constants';

const Leave: React.FC = () => {
  const { leaveRequests, approveLeave, rejectLeave, addToast } = useAppStore();
  const { user, hasPermission } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const canApprove = hasPermission('canApproveLeave');

  // Filter requests based on user permissions
  const visibleRequests = useMemo(() => {
    if (canApprove) {
      // Managers can see all requests
      return leaveRequests;
    }
    // Regular staff can only see their own requests
    return leaveRequests.filter(r => r.staffId === user?.staffId);
  }, [leaveRequests, canApprove, user?.staffId]);

  const filteredRequests = visibleRequests.filter((r) => filter === 'all' || r.status === filter);

  const pendingCount = visibleRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = visibleRequests.filter((r) => r.status === 'approved').length;

  const handleApprove = (id: string) => {
    if (!canApprove) {
      addToast('You do not have permission to approve leave requests', 'error');
      return;
    }
    approveLeave(id);
    addToast('Leave request approved', 'success');
  };

  const handleReject = (id: string) => {
    if (!canApprove) {
      addToast('You do not have permission to reject leave requests', 'error');
      return;
    }
    rejectLeave(id);
    addToast('Leave request rejected', 'info');
  };

  const getLeaveTypeInfo = (type: string) => {
    return LEAVE_TYPES.find((t) => t.id === type) || LEAVE_TYPES[0];
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Pending Requests', value: pendingCount, icon: '⏳', color: '#FFB020' },
          { label: 'Approved', value: approvedCount, icon: '✅', color: '#00D26A' },
          { label: 'On Leave Today', value: 2, icon: '🏖️', color: '#0066FF' },
          { label: 'Upcoming', value: 5, icon: '📅', color: '#667EEA' },
        ].map((stat, i) => (
          <Card3D
            key={i}
            intensity={12}
            className="glass-card p-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}30` }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            </div>
          </Card3D>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex bg-white/5 rounded-xl p-1">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                filter === status
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white/70'
              )}
            >
              {status}
              {status === 'pending' && pendingCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-amc-orange/20 text-amc-orange rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <Button
          variant="secondary"
          icon={<Filter className="w-4 h-4" />}
          onClick={() => addToast('Advanced filters coming soon', 'info')}
        >
          Filters
        </Button>
      </div>

      {/* Leave Requests List */}
      <div className="grid grid-cols-2 gap-6">
        {filteredRequests.map((request, i) => {
          const leaveType = getLeaveTypeInfo(request.type);
          return (
            <Card3D
              key={request.id}
              intensity={10}
              className="glass-card p-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={request.staffName}
                    type="nurse"
                    size="lg"
                  />
                  <div>
                    <h3 className="font-semibold">{request.staffName}</h3>
                    <p className="text-sm text-white/50">{request.staffRole}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    request.status === 'approved'
                      ? 'success'
                      : request.status === 'rejected'
                        ? 'danger'
                        : 'warning'
                  }
                >
                  {request.status}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: leaveType.color }}
                  />
                  <span className="text-sm text-white/70">{leaveType.label}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-white/40" />
                  <span className="text-white/70">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-white/40" />
                  <span className="text-white/50">
                    Applied: {formatDate(request.appliedDate)}
                  </span>
                </div>
              </div>

              {/* Reason */}
              <div className="p-3 bg-white/5 rounded-xl mb-4">
                <p className="text-sm text-white/70">{request.reason}</p>
              </div>

              {/* Actions */}
              {request.status === 'pending' && canApprove && (
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    icon={<X className="w-4 h-4" />}
                    onClick={() => handleReject(request.id)}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    icon={<Check className="w-4 h-4" />}
                    onClick={() => handleApprove(request.id)}
                  >
                    Approve
                  </Button>
                </div>
              )}
              {request.status === 'pending' && !canApprove && (
                <div className="p-3 rounded-xl bg-amc-blue/10 border border-amc-blue/20 flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-amc-blue" />
                  <span className="text-white/70">Awaiting manager approval</span>
                </div>
              )}
            </Card3D>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-white/50">No leave requests found</p>
        </div>
      )}
    </div>
  );
};

export default Leave;
