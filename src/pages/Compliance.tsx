import React, { useState } from 'react';
import {
  Shield, CheckCircle, XCircle, AlertTriangle, Clock, FileText,
  Award, Calendar, Download, Eye, ChevronRight, Lock,
  ClipboardCheck, Building2, Activity, TrendingUp
} from 'lucide-react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import DonutChart from '../components/charts/DonutChart';
import { useAppStore } from '../stores/appStore';

interface ComplianceItem {
  id: string;
  category: string;
  requirement: string;
  status: 'compliant' | 'pending' | 'non-compliant' | 'in-progress';
  dueDate: string;
  lastChecked: string;
  owner: string;
  priority: 'high' | 'medium' | 'low';
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: 'success' | 'warning' | 'error';
  ipAddress: string;
}

interface Certification {
  id: string;
  staffName: string;
  certification: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
  department: string;
}

const Compliance: React.FC = () => {
  const { addToast } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'certifications' | 'audit'>('overview');

  const complianceItems: ComplianceItem[] = [
    { id: '1', category: 'GHS Reporting', requirement: 'Monthly patient statistics submission', status: 'compliant', dueDate: '2025-12-01', lastChecked: '2025-11-28', owner: 'Dr. Opoku-Akoto', priority: 'high' },
    { id: '2', category: 'GHS Reporting', requirement: 'Infectious disease notification', status: 'compliant', dueDate: 'Ongoing', lastChecked: '2025-11-30', owner: 'Dr. Mensah', priority: 'high' },
    { id: '3', category: 'Data Protection', requirement: 'Patient consent forms digitized', status: 'in-progress', dueDate: '2025-12-15', lastChecked: '2025-11-25', owner: 'IT Department', priority: 'high' },
    { id: '4', category: 'Data Protection', requirement: 'Data breach response plan', status: 'compliant', dueDate: '2026-01-01', lastChecked: '2025-11-20', owner: 'Security Team', priority: 'medium' },
    { id: '5', category: 'Data Protection', requirement: 'Staff privacy training completion', status: 'pending', dueDate: '2025-12-10', lastChecked: '2025-11-15', owner: 'HR Department', priority: 'high' },
    { id: '6', category: 'Facility Standards', requirement: 'Fire safety inspection', status: 'compliant', dueDate: '2026-03-01', lastChecked: '2025-09-15', owner: 'Facilities', priority: 'high' },
    { id: '7', category: 'Facility Standards', requirement: 'Medical waste disposal audit', status: 'compliant', dueDate: '2025-12-30', lastChecked: '2025-11-10', owner: 'Environmental', priority: 'medium' },
    { id: '8', category: 'NHIA', requirement: 'Claims reconciliation report', status: 'pending', dueDate: '2025-12-05', lastChecked: '2025-11-28', owner: 'Finance', priority: 'high' },
    { id: '9', category: 'Quality Assurance', requirement: 'Clinical audit completion', status: 'in-progress', dueDate: '2025-12-20', lastChecked: '2025-11-22', owner: 'Quality Team', priority: 'medium' },
    { id: '10', category: 'Quality Assurance', requirement: 'Patient satisfaction survey', status: 'compliant', dueDate: '2025-12-31', lastChecked: '2025-11-25', owner: 'Patient Services', priority: 'low' },
  ];

  const auditLogs: AuditLog[] = [
    { id: '1', timestamp: '2025-11-30 14:32:15', user: 'Dr. K. Asante', action: 'Accessed patient record', resource: 'Patient #12847', status: 'success', ipAddress: '192.168.1.45' },
    { id: '2', timestamp: '2025-11-30 14:28:03', user: 'Nurse A. Mensah', action: 'Updated medication', resource: 'Patient #12923', status: 'success', ipAddress: '192.168.1.67' },
    { id: '3', timestamp: '2025-11-30 14:15:22', user: 'Admin User', action: 'Modified user permissions', resource: 'User: Dr. Boateng', status: 'warning', ipAddress: '192.168.1.10' },
    { id: '4', timestamp: '2025-11-30 13:55:18', user: 'System', action: 'Backup completed', resource: 'Database', status: 'success', ipAddress: 'localhost' },
    { id: '5', timestamp: '2025-11-30 13:42:09', user: 'Dr. E. Owusu', action: 'Failed login attempt', resource: 'Authentication', status: 'error', ipAddress: '192.168.1.89' },
    { id: '6', timestamp: '2025-11-30 13:30:00', user: 'System', action: 'SSL certificate check', resource: 'Security', status: 'success', ipAddress: 'localhost' },
    { id: '7', timestamp: '2025-11-30 12:45:33', user: 'Finance User', action: 'Generated NHIA report', resource: 'Reports', status: 'success', ipAddress: '192.168.1.23' },
    { id: '8', timestamp: '2025-11-30 12:20:11', user: 'HR Admin', action: 'Added new staff', resource: 'Staff #219', status: 'success', ipAddress: '192.168.1.15' },
  ];

  const certifications: Certification[] = [
    { id: '1', staffName: 'Dr. Kwame Asante', certification: 'Medical License', issueDate: '2023-01-15', expiryDate: '2026-01-15', status: 'valid', department: 'Emergency' },
    { id: '2', staffName: 'Dr. Ama Mensah', certification: 'Specialist Certificate - Cardiology', issueDate: '2022-06-01', expiryDate: '2025-06-01', status: 'expiring', department: 'Cardiology' },
    { id: '3', staffName: 'Nurse Akua Darko', certification: 'Nursing License', issueDate: '2024-03-20', expiryDate: '2027-03-20', status: 'valid', department: 'Pediatrics' },
    { id: '4', staffName: 'Tech. Kofi Osei', certification: 'Radiology Technician', issueDate: '2021-09-10', expiryDate: '2024-09-10', status: 'expired', department: 'Radiology' },
    { id: '5', staffName: 'Dr. Yaw Boateng', certification: 'BLS/ACLS Certification', issueDate: '2024-01-05', expiryDate: '2026-01-05', status: 'valid', department: 'Surgery' },
    { id: '6', staffName: 'Nurse Efua Ansah', certification: 'Critical Care Nursing', issueDate: '2023-07-15', expiryDate: '2025-07-15', status: 'expiring', department: 'ICU' },
  ];

  const compliantCount = complianceItems.filter(i => i.status === 'compliant').length;
  const pendingCount = complianceItems.filter(i => i.status === 'pending' || i.status === 'in-progress').length;
  const validCerts = certifications.filter(c => c.status === 'valid').length;
  const expiringCerts = certifications.filter(c => c.status === 'expiring').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'valid':
      case 'success':
        return 'text-amc-green';
      case 'pending':
      case 'in-progress':
      case 'expiring':
      case 'warning':
        return 'text-amc-orange';
      case 'non-compliant':
      case 'expired':
      case 'error':
        return 'text-amc-red';
      default:
        return 'text-white/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'valid':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-amc-green" />;
      case 'pending':
      case 'expiring':
      case 'warning':
        return <Clock className="w-4 h-4 text-amc-orange" />;
      case 'in-progress':
        return <Activity className="w-4 h-4 text-amc-blue" />;
      case 'non-compliant':
      case 'expired':
      case 'error':
        return <XCircle className="w-4 h-4 text-amc-red" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-white/50" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Compliance Score', value: `${Math.round((compliantCount / complianceItems.length) * 100)}%`, icon: <Shield className="w-5 h-5" />, color: '#00D26A' },
          { label: 'Items Compliant', value: `${compliantCount}/${complianceItems.length}`, icon: <CheckCircle className="w-5 h-5" />, color: '#00D4AA' },
          { label: 'Pending Actions', value: pendingCount, icon: <Clock className="w-5 h-5" />, color: '#FFB020' },
          { label: 'Valid Certifications', value: `${validCerts}/${certifications.length}`, icon: <Award className="w-5 h-5" />, color: '#667EEA' }
        ].map((stat, i) => (
          <Card3D
            key={i}
            intensity={12}
            className="glass-card p-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.color}20`, color: stat.color }}
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

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'checklist', label: 'Compliance Checklist', icon: <ClipboardCheck className="w-4 h-4" /> },
          { id: 'certifications', label: 'Staff Certifications', icon: <Award className="w-4 h-4" /> },
          { id: 'audit', label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-amc-teal to-amc-blue text-white'
                : 'text-white/50 hover:text-white/70'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Compliance by Category */}
          <Card3D intensity={5} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amc-teal" />
              Compliance by Category
            </h3>
            <div className="space-y-4">
              {['GHS Reporting', 'Data Protection', 'Facility Standards', 'NHIA', 'Quality Assurance'].map((category) => {
                const items = complianceItems.filter(i => i.category === category);
                const compliant = items.filter(i => i.status === 'compliant').length;
                const percentage = Math.round((compliant / items.length) * 100);

                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{category}</span>
                      <span className={clsx(
                        'text-sm font-bold',
                        percentage >= 80 ? 'text-amc-green' : percentage >= 50 ? 'text-amc-orange' : 'text-amc-red'
                      )}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          background: percentage >= 80 ? '#00D26A' : percentage >= 50 ? '#FFB020' : '#FF4757'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card3D>

          {/* Overall Compliance Score */}
          <Card3D intensity={5} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amc-purple" />
              Overall Compliance
            </h3>
            <div className="flex items-center justify-center">
              <DonutChart
                value={compliantCount}
                max={complianceItems.length}
                size={180}
                strokeWidth={16}
                color="#00D26A"
                label="Compliant"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-xl font-bold text-amc-green">{compliantCount}</div>
                <div className="text-xs text-white/40">Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-amc-orange">{pendingCount}</div>
                <div className="text-xs text-white/40">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-amc-red">0</div>
                <div className="text-xs text-white/40">Non-Compliant</div>
              </div>
            </div>
          </Card3D>

          {/* Upcoming Deadlines */}
          <Card3D intensity={5} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amc-orange" />
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {complianceItems
                .filter(i => i.status !== 'compliant' && i.dueDate !== 'Ongoing')
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <div className="text-sm font-medium">{item.requirement}</div>
                        <div className="text-xs text-white/40">{item.category}</div>
                      </div>
                    </div>
                    <Badge variant={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'default'}>
                      {item.dueDate}
                    </Badge>
                  </div>
                ))}
            </div>
          </Card3D>

          {/* Certification Alerts */}
          <Card3D intensity={5} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amc-blue" />
              Certification Alerts
            </h3>
            <div className="space-y-3">
              {certifications
                .filter(c => c.status !== 'valid')
                .map((cert) => (
                  <div key={cert.id} className={clsx(
                    'p-4 rounded-xl border',
                    cert.status === 'expired' ? 'bg-amc-red/10 border-amc-red/20' : 'bg-amc-orange/10 border-amc-orange/20'
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{cert.staffName}</div>
                      <Badge variant={cert.status === 'expired' ? 'danger' : 'warning'}>
                        {cert.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-white/60">{cert.certification}</div>
                    <div className="text-xs text-white/40 mt-1">Expires: {cert.expiryDate}</div>
                  </div>
                ))}
              {certifications.filter(c => c.status !== 'valid').length === 0 && (
                <div className="text-center py-8 text-white/40">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-amc-green" />
                  <p>All certifications are up to date</p>
                </div>
              )}
            </div>
          </Card3D>
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <Card3D intensity={5} className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-amc-teal" />
              Compliance Checklist
            </h3>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => addToast('Exporting compliance report...', 'info')}
            >
              Export Report
            </Button>
          </div>
          <div className="space-y-2">
            {complianceItems.map((item) => (
              <Card3D
                key={item.id}
                intensity={10}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04]"
              >
                {getStatusIcon(item.status)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.requirement}</div>
                  <div className="text-xs text-white/40">{item.category} • Owner: {item.owner}</div>
                </div>
                <Badge variant={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'default'} size="sm">
                  {item.priority}
                </Badge>
                <div className="text-right">
                  <div className="text-xs text-white/50">Due: {item.dueDate}</div>
                  <div className="text-xs text-white/30">Checked: {item.lastChecked}</div>
                </div>
                <Badge
                  variant={
                    item.status === 'compliant' ? 'success' :
                    item.status === 'in-progress' ? 'info' :
                    item.status === 'pending' ? 'warning' : 'danger'
                  }
                >
                  {item.status}
                </Badge>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </Card3D>
            ))}
          </div>
        </Card3D>
      )}

      {/* Certifications Tab */}
      {activeTab === 'certifications' && (
        <Card3D intensity={5} className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-amc-purple" />
              Staff Certifications
            </h3>
            <div className="flex gap-2">
              <Badge variant="success">{validCerts} Valid</Badge>
              <Badge variant="warning">{expiringCerts} Expiring</Badge>
              <Badge variant="danger">{certifications.filter(c => c.status === 'expired').length} Expired</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <Card3D
                key={cert.id}
                intensity={10}
                className={clsx(
                  'p-4 rounded-xl border',
                  cert.status === 'valid' && 'bg-white/[0.02] border-white/5',
                  cert.status === 'expiring' && 'bg-amc-orange/5 border-amc-orange/20',
                  cert.status === 'expired' && 'bg-amc-red/5 border-amc-red/20'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                      cert.status === 'valid' && 'bg-amc-green/20 text-amc-green',
                      cert.status === 'expiring' && 'bg-amc-orange/20 text-amc-orange',
                      cert.status === 'expired' && 'bg-amc-red/20 text-amc-red'
                    )}>
                      {cert.staffName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium">{cert.staffName}</div>
                      <div className="text-xs text-white/40">{cert.department}</div>
                    </div>
                  </div>
                  {getStatusIcon(cert.status)}
                </div>
                <div className="text-sm text-white/70 mb-2">{cert.certification}</div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>Issued: {cert.issueDate}</span>
                  <span className={getStatusColor(cert.status)}>Expires: {cert.expiryDate}</span>
                </div>
              </Card3D>
            ))}
          </div>
        </Card3D>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <Card3D intensity={5} className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lock className="w-5 h-5 text-amc-blue" />
              Audit Trail
            </h3>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Eye className="w-4 h-4" />}
                onClick={() => addToast('Full audit log viewer coming soon', 'info')}
              >
                View Full Log
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => addToast('Exporting audit logs...', 'info')}
              >
                Export
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-[180px_150px_1fr_150px_120px_100px] gap-4 px-4 py-2 text-xs font-medium text-white/40 border-b border-white/10">
              <div>Timestamp</div>
              <div>User</div>
              <div>Action</div>
              <div>Resource</div>
              <div>IP Address</div>
              <div>Status</div>
            </div>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-[180px_150px_1fr_150px_120px_100px] gap-4 px-4 py-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] items-center text-sm"
              >
                <div className="text-white/60 font-mono text-xs">{log.timestamp}</div>
                <div className="font-medium truncate">{log.user}</div>
                <div className="text-white/70">{log.action}</div>
                <div className="text-white/50 truncate">{log.resource}</div>
                <div className="text-white/40 font-mono text-xs">{log.ipAddress}</div>
                <div>{getStatusIcon(log.status)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-amc-blue/10 border border-amc-blue/20">
            <div className="flex items-center gap-2 text-amc-blue text-sm">
              <Lock className="w-4 h-4" />
              <span className="font-medium">Audit logs are encrypted and retained for 7 years per regulatory requirements</span>
            </div>
          </div>
        </Card3D>
      )}
    </div>
  );
};

export default Compliance;
