import React, { useState } from 'react';
import {
  Database, Server, Cloud, Shield, RefreshCw, CheckCircle,
  XCircle, AlertTriangle, Settings, Activity, Zap, Link2,
  FileText, CreditCard, Pill, FlaskConical, Users, Building2,
  Eye, EyeOff, Copy, ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { useAppStore } from '../stores/appStore';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  recordsSync: number;
  category: 'core' | 'external' | 'government';
  uptime: number;
  apiHealth: number;
}

const Integrations: React.FC = () => {
  const { addToast } = useAppStore();
  const [syncing, setSyncing] = useState<string | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [configForm, setConfigForm] = useState({
    apiKey: '',
    apiSecret: '',
    endpoint: '',
    webhookUrl: '',
  });

  const integrations: Integration[] = [
    {
      id: 'emr',
      name: 'Electronic Medical Records',
      description: 'Core patient records and medical history system',
      icon: <FileText className="w-6 h-6" />,
      status: 'connected',
      lastSync: '2 minutes ago',
      recordsSync: 89420,
      category: 'core',
      uptime: 99.9,
      apiHealth: 100
    },
    {
      id: 'nhia',
      name: 'NHIA Claims Portal',
      description: 'National Health Insurance Authority integration',
      icon: <CreditCard className="w-6 h-6" />,
      status: 'connected',
      lastSync: '15 minutes ago',
      recordsSync: 12840,
      category: 'government',
      uptime: 98.5,
      apiHealth: 95
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy Management',
      description: 'Drug inventory and prescription tracking',
      icon: <Pill className="w-6 h-6" />,
      status: 'syncing',
      lastSync: 'Syncing now...',
      recordsSync: 34200,
      category: 'core',
      uptime: 99.7,
      apiHealth: 100
    },
    {
      id: 'lab',
      name: 'Laboratory Information System',
      description: 'Lab results and diagnostic data integration',
      icon: <FlaskConical className="w-6 h-6" />,
      status: 'connected',
      lastSync: '5 minutes ago',
      recordsSync: 28900,
      category: 'core',
      uptime: 99.8,
      apiHealth: 98
    },
    {
      id: 'hr',
      name: 'HR & Payroll System',
      description: 'Staff records, scheduling, and payroll data',
      icon: <Users className="w-6 h-6" />,
      status: 'connected',
      lastSync: '1 hour ago',
      recordsSync: 219,
      category: 'core',
      uptime: 99.5,
      apiHealth: 100
    },
    {
      id: 'ghs',
      name: 'Ghana Health Service',
      description: 'Regulatory reporting and compliance data',
      icon: <Building2 className="w-6 h-6" />,
      status: 'disconnected',
      lastSync: 'Not configured',
      recordsSync: 0,
      category: 'government',
      uptime: 0,
      apiHealth: 0
    },
    {
      id: 'billing',
      name: 'Billing & Revenue',
      description: 'Financial transactions and billing records',
      icon: <CreditCard className="w-6 h-6" />,
      status: 'connected',
      lastSync: '30 seconds ago',
      recordsSync: 156780,
      category: 'core',
      uptime: 99.9,
      apiHealth: 100
    },
    {
      id: 'imaging',
      name: 'Radiology & Imaging',
      description: 'PACS integration for medical imaging',
      icon: <Activity className="w-6 h-6" />,
      status: 'error',
      lastSync: 'Connection failed',
      recordsSync: 8920,
      category: 'core',
      uptime: 85.2,
      apiHealth: 0
    }
  ];

  const handleSync = (id: string) => {
    setSyncing(id);
    addToast(`Syncing ${integrations.find(i => i.id === id)?.name}...`, 'info');
    setTimeout(() => {
      setSyncing(null);
      addToast('Sync completed successfully', 'success');
    }, 2000);
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowConfigModal(true);
    setShowApiKey(false);
    setConfigForm({
      apiKey: '',
      apiSecret: '',
      endpoint: integration.id === 'ghs' ? 'https://api.ghs.gov.gh/v1/' : 'https://api.example.com/v1/',
      webhookUrl: `https://amc-hub.example.com/webhooks/${integration.id}`,
    });
  };

  const handleSaveConfig = () => {
    if (!configForm.apiKey || !configForm.apiSecret) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    addToast(`${selectedIntegration?.name} configured successfully!`, 'success');
    setShowConfigModal(false);
    setSelectedIntegration(null);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast(`${label} copied to clipboard`, 'success');
  };

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'text-amc-green';
      case 'syncing': return 'text-amc-blue';
      case 'error': return 'text-amc-red';
      default: return 'text-white/40';
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-5 h-5 text-amc-green" />;
      case 'syncing': return <RefreshCw className="w-5 h-5 text-amc-blue animate-spin" />;
      case 'error': return <XCircle className="w-5 h-5 text-amc-red" />;
      default: return <AlertTriangle className="w-5 h-5 text-white/40" />;
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalRecords = integrations.reduce((sum, i) => sum + i.recordsSync, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Connected Systems', value: connectedCount, total: integrations.length, icon: <Link2 className="w-5 h-5" />, color: '#00D26A' },
          { label: 'Total Records Synced', value: totalRecords.toLocaleString(), icon: <Database className="w-5 h-5" />, color: '#0066FF' },
          { label: 'Average Uptime', value: '98.2%', icon: <Activity className="w-5 h-5" />, color: '#00D4AA' },
          { label: 'API Health Score', value: '94/100', icon: <Zap className="w-5 h-5" />, color: '#667EEA' }
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
                  {stat.total && <span className="text-white/40 text-lg">/{stat.total}</span>}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            </div>
          </Card3D>
        ))}
      </div>

      {/* System Architecture Diagram */}
      <Card3D intensity={5} className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Server className="w-5 h-5 text-amc-teal" />
          System Architecture
        </h3>
        <div className="relative">
          {/* Central Hub */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amc-teal/30 to-amc-blue/30 border-2 border-amc-teal/50 flex items-center justify-center">
                <div className="text-center">
                  <Cloud className="w-8 h-8 text-amc-teal mx-auto mb-1" />
                  <div className="text-sm font-semibold">AMC Hub</div>
                  <div className="text-xs text-white/50">Central Platform</div>
                </div>
              </div>
              {/* Pulse animation */}
              <div className="absolute inset-0 rounded-full border-2 border-amc-teal/30 animate-ping" />
            </div>
          </div>

          {/* Connection Lines & Systems */}
          <div className="grid grid-cols-4 gap-4">
            {integrations.slice(0, 8).map((integration) => (
              <div
                key={integration.id}
                className={clsx(
                  'relative p-4 rounded-xl border text-center transition-all',
                  integration.status === 'connected' && 'bg-amc-green/5 border-amc-green/20',
                  integration.status === 'syncing' && 'bg-amc-blue/5 border-amc-blue/20',
                  integration.status === 'error' && 'bg-amc-red/5 border-amc-red/20',
                  integration.status === 'disconnected' && 'bg-white/5 border-white/10'
                )}
              >
                {/* Connection line indicator */}
                <div className={clsx(
                  'absolute -top-4 left-1/2 w-0.5 h-4',
                  integration.status === 'connected' && 'bg-amc-green',
                  integration.status === 'syncing' && 'bg-amc-blue animate-pulse',
                  integration.status === 'error' && 'bg-amc-red',
                  integration.status === 'disconnected' && 'bg-white/20 border-dashed'
                )} />

                <div className={clsx('mb-2', getStatusColor(integration.status))}>
                  {integration.icon}
                </div>
                <div className="text-sm font-medium truncate">{integration.name.split(' ')[0]}</div>
                <div className="mt-2">{getStatusIcon(integration.status)}</div>
              </div>
            ))}
          </div>
        </div>
      </Card3D>

      {/* Integration Cards */}
      <div className="grid grid-cols-2 gap-6">
        {/* Core Systems */}
        <Card3D intensity={5} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-amc-blue" />
            Core Hospital Systems
          </h3>
          <div className="space-y-3">
            {integrations.filter(i => i.category === 'core').map((integration) => (
              <div
                key={integration.id}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-4"
              >
                <div className={clsx(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  integration.status === 'connected' && 'bg-amc-green/20 text-amc-green',
                  integration.status === 'syncing' && 'bg-amc-blue/20 text-amc-blue',
                  integration.status === 'error' && 'bg-amc-red/20 text-amc-red',
                  integration.status === 'disconnected' && 'bg-white/10 text-white/40'
                )}>
                  {integration.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{integration.name}</div>
                  <div className="text-sm text-white/50">{integration.lastSync}</div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      integration.status === 'connected' ? 'success' :
                      integration.status === 'syncing' ? 'info' :
                      integration.status === 'error' ? 'danger' : 'default'
                    }
                  >
                    {integration.status}
                  </Badge>
                  <div className="text-xs text-white/40 mt-1">
                    {integration.recordsSync.toLocaleString()} records
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={syncing === integration.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                  onClick={() => handleSync(integration.id)}
                  disabled={syncing === integration.id || integration.status === 'disconnected'}
                >
                  Sync
                </Button>
              </div>
            ))}
          </div>
        </Card3D>

        {/* External & Government Systems */}
        <Card3D intensity={5} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amc-purple" />
            Government & External Systems
          </h3>
          <div className="space-y-3">
            {integrations.filter(i => i.category === 'government').map((integration) => (
              <div
                key={integration.id}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={clsx(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    integration.status === 'connected' && 'bg-amc-green/20 text-amc-green',
                    integration.status === 'disconnected' && 'bg-white/10 text-white/40'
                  )}>
                    {integration.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{integration.name}</div>
                    <div className="text-sm text-white/50">{integration.description}</div>
                  </div>
                  <Badge
                    variant={integration.status === 'connected' ? 'success' : 'default'}
                  >
                    {integration.status}
                  </Badge>
                </div>

                {integration.status === 'connected' ? (
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/5">
                    <div>
                      <div className="text-lg font-bold text-amc-green">{integration.uptime}%</div>
                      <div className="text-xs text-white/40">Uptime</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-amc-blue">{integration.recordsSync.toLocaleString()}</div>
                      <div className="text-xs text-white/40">Records</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-amc-teal">{integration.apiHealth}%</div>
                      <div className="text-xs text-white/40">API Health</div>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Settings className="w-4 h-4" />}
                    onClick={() => handleConfigure(integration)}
                    className="w-full mt-2"
                  >
                    Configure Integration
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* API Configuration Notice */}
          <div className="mt-6 p-4 rounded-xl bg-amc-purple/10 border border-amc-purple/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amc-purple mt-0.5" />
              <div>
                <div className="font-medium text-amc-purple">Secure API Configuration</div>
                <div className="text-sm text-white/60 mt-1">
                  Government integrations require secure API keys and compliance verification.
                  Contact your system administrator to configure these connections.
                </div>
              </div>
            </div>
          </div>
        </Card3D>
      </div>

      {/* Data Flow Monitor */}
      <Card3D intensity={5} className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-amc-orange" />
          Real-time Data Flow
        </h3>
        <div className="grid grid-cols-6 gap-4">
          {[
            { label: 'Patient Records', rate: '24/min', trend: 'up' },
            { label: 'Lab Results', rate: '8/min', trend: 'up' },
            { label: 'Prescriptions', rate: '12/min', trend: 'stable' },
            { label: 'Appointments', rate: '6/min', trend: 'up' },
            { label: 'Billing Events', rate: '18/min', trend: 'up' },
            { label: 'Insurance Claims', rate: '3/min', trend: 'stable' }
          ].map((flow, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-xl font-bold text-amc-teal">{flow.rate}</div>
              <div className="text-xs text-white/50 mt-1">{flow.label}</div>
              <div className={clsx(
                'text-xs mt-2',
                flow.trend === 'up' ? 'text-amc-green' : 'text-white/40'
              )}>
                {flow.trend === 'up' ? '↑ Active' : '→ Stable'}
              </div>
            </div>
          ))}
        </div>
      </Card3D>

      {/* Configuration Modal */}
      <Modal
        isOpen={showConfigModal && selectedIntegration !== null}
        onClose={() => {
          setShowConfigModal(false);
          setSelectedIntegration(null);
        }}
        title={`Configure ${selectedIntegration?.name || 'Integration'}`}
        size="lg"
      >
        {selectedIntegration && (
          <div className="space-y-6">
            {/* Integration Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <div className="w-14 h-14 rounded-xl bg-amc-purple/20 text-amc-purple flex items-center justify-center">
                {selectedIntegration.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{selectedIntegration.name}</h3>
                <p className="text-sm text-white/60">{selectedIntegration.description}</p>
              </div>
              <Badge variant="warning">Not Configured</Badge>
            </div>

            {/* API Credentials */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-amc-teal" />
                API Credentials
              </h4>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  API Key <span className="text-amc-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={configForm.apiKey}
                    onChange={(e) => setConfigForm({ ...configForm, apiKey: e.target.value })}
                    placeholder="Enter your API key"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-20 text-white placeholder-white/30 focus:outline-none focus:border-amc-teal"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4 text-white/50" /> : <Eye className="w-4 h-4 text-white/50" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  API Secret <span className="text-amc-red">*</span>
                </label>
                <input
                  type="password"
                  value={configForm.apiSecret}
                  onChange={(e) => setConfigForm({ ...configForm, apiSecret: e.target.value })}
                  placeholder="Enter your API secret"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amc-teal"
                />
              </div>
            </div>

            {/* Endpoint Configuration */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Server className="w-4 h-4 text-amc-blue" />
                Endpoint Configuration
              </h4>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  API Endpoint
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={configForm.endpoint}
                    onChange={(e) => setConfigForm({ ...configForm, endpoint: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-20 text-white focus:outline-none focus:border-amc-teal"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(configForm.endpoint, 'Endpoint')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-white/50" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Webhook URL (for receiving updates)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={configForm.webhookUrl}
                    readOnly
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-20 text-white/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(configForm.webhookUrl, 'Webhook URL')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-white/50" />
                  </button>
                </div>
                <p className="text-xs text-white/40 mt-1">
                  Add this URL to your external system to receive real-time updates
                </p>
              </div>
            </div>

            {/* Documentation Link */}
            <div className="p-4 rounded-xl bg-amc-blue/10 border border-amc-blue/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amc-blue" />
                  <div>
                    <div className="font-medium">Integration Documentation</div>
                    <div className="text-sm text-white/50">View setup guide and API reference</div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<ExternalLink className="w-4 h-4" />}
                  onClick={() => addToast('Opening documentation...', 'info')}
                >
                  View Docs
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  addToast('Testing connection...', 'info');
                  setTimeout(() => {
                    if (configForm.apiKey && configForm.apiSecret) {
                      addToast('Connection test successful!', 'success');
                    } else {
                      addToast('Connection test failed - missing credentials', 'error');
                    }
                  }, 1500);
                }}
              >
                Test Connection
              </Button>
              <Button className="flex-1" onClick={handleSaveConfig}>
                Save Configuration
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Integrations;
