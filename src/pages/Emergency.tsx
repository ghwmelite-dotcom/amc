import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Truck, Heart, Activity, Users, Clock, PhoneCall, PhoneOff, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Avatar from '../components/common/Avatar';
import DonutChart from '../components/charts/DonutChart';
import { useAppStore } from '../stores/appStore';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface EmergencyCase {
  id: string;
  patient: string;
  age: number;
  condition: string;
  priority: 'critical' | 'high' | 'medium';
  time: string;
  status: string;
}

interface Contact {
  name: string;
  number: string;
  icon: string;
}

const Emergency: React.FC = () => {
  const { soundEnabled, addToast } = useAppStore();
  const { playSound } = useSoundEffects();
  const [activeEmergencies, setActiveEmergencies] = useState(3);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);
  const [showCaseModal, setShowCaseModal] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update emergency count for demo
      if (Math.random() > 0.8) {
        setActiveEmergencies((prev) => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const emergencyCases: EmergencyCase[] = [
    { id: 'E001', patient: 'Kofi Mensah', age: 58, condition: 'Cardiac Arrest', priority: 'critical', time: '5 min', status: 'treating' },
    { id: 'E002', patient: 'Ama Boateng', age: 32, condition: 'Severe Trauma', priority: 'critical', time: '12 min', status: 'stabilizing' },
    { id: 'E003', patient: 'Yaw Asante', age: 45, condition: 'Respiratory Distress', priority: 'high', time: '20 min', status: 'monitoring' },
    { id: 'E004', patient: 'Akua Darko', age: 28, condition: 'Allergic Reaction', priority: 'medium', time: '35 min', status: 'stable' },
  ];

  const icuBeds = [
    { id: 1, status: 'occupied', patient: 'K. Mensah' },
    { id: 2, status: 'occupied', patient: 'A. Boateng' },
    { id: 3, status: 'available', patient: null },
    { id: 4, status: 'occupied', patient: 'E. Owusu' },
    { id: 5, status: 'available', patient: null },
    { id: 6, status: 'maintenance', patient: null },
  ];

  const ambulances = [
    { id: 'AMB-01', status: 'available', location: 'Base Station' },
    { id: 'AMB-02', status: 'en-route', location: 'Osu, Accra', eta: '8 min' },
    { id: 'AMB-03', status: 'returning', location: 'Korle-Bu', eta: '15 min' },
  ];

  // Call duration timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (callInProgress) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callInProgress]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setShowCallModal(true);
    setCallDuration(0);
  };

  const startCall = () => {
    if (soundEnabled) playSound('alert');
    setCallInProgress(true);
    addToast(`Connecting to ${selectedContact?.name}...`, 'info');
  };

  const endCall = () => {
    setCallInProgress(false);
    addToast(`Call ended - Duration: ${formatCallDuration(callDuration)}`, 'success');
    setShowCallModal(false);
    setSelectedContact(null);
    setCallDuration(0);
  };

  const handleCaseClick = (emergency: EmergencyCase) => {
    setSelectedCase(emergency);
    setShowCaseModal(true);
  };

  const handleEmergencyCall = () => {
    if (soundEnabled) playSound('alert');
    addToast('Emergency response team notified!', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Critical Alert Banner */}
      {activeEmergencies > 2 && (
        <div className="p-4 rounded-2xl bg-amc-red/20 border border-amc-red/30 flex items-center justify-between animate-alert-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amc-red" />
            <div>
              <div className="font-semibold text-amc-red">High Emergency Volume</div>
              <div className="text-sm text-white/60">{activeEmergencies} active emergencies - Additional staff may be required</div>
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleEmergencyCall}
          >
            Alert Response Team
          </Button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Active Cases', value: activeEmergencies, icon: '🚨', color: '#FF4757' },
          { label: 'ICU Available', value: 2, icon: '🛏️', color: '#00D26A' },
          { label: 'Staff On Duty', value: 8, icon: '👥', color: '#0066FF' },
          { label: 'Avg Response', value: '4.2m', icon: '⚡', color: '#00D4AA' },
          { label: 'Ambulances', value: '1/3', icon: '🚑', color: '#FFB020' },
        ].map((stat, i) => (
          <Card3D
            key={i}
            intensity={12}
            className="glass-card p-5 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: `${stat.color}20` }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            </div>
          </Card3D>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_400px] gap-6">
        {/* Main Section */}
        <div className="space-y-6">
          {/* Emergency Cases */}
          <Card3D intensity={5} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5 text-amc-red" />
                Active Emergency Cases
              </h3>
              <Badge variant="danger" dot pulse>
                {emergencyCases.length} Active
              </Badge>
            </div>

            <div className="space-y-3">
              {emergencyCases.map((emergency) => (
                <Card3D
                  key={emergency.id}
                  intensity={10}
                  onClick={() => handleCaseClick(emergency)}
                  className={clsx(
                    'p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01]',
                    emergency.priority === 'critical' && 'bg-amc-red/10 border border-amc-red/20',
                    emergency.priority === 'high' && 'bg-amc-orange/10 border border-amc-orange/20',
                    emergency.priority === 'medium' && 'bg-amc-yellow/10 border border-amc-yellow/20'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {emergency.patient}
                        <span className="text-sm text-white/50">({emergency.age} yrs)</span>
                      </div>
                      <div className="text-sm text-white/60">{emergency.condition}</div>
                    </div>
                    <Badge
                      variant={
                        emergency.priority === 'critical'
                          ? 'danger'
                          : emergency.priority === 'high'
                            ? 'warning'
                            : 'info'
                      }
                    >
                      {emergency.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Clock className="w-4 h-4" />
                      {emergency.time} ago
                    </div>
                    <Badge variant="default" size="sm">
                      {emergency.status}
                    </Badge>
                  </div>
                </Card3D>
              ))}
            </div>
          </Card3D>

          {/* Ambulance Status */}
          <Card3D intensity={5} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amc-orange" />
              Ambulance Fleet
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {ambulances.map((amb) => (
                <div
                  key={amb.id}
                  className={clsx(
                    'p-4 rounded-xl border',
                    amb.status === 'available' && 'bg-amc-green/10 border-amc-green/20',
                    amb.status === 'en-route' && 'bg-amc-orange/10 border-amc-orange/20',
                    amb.status === 'returning' && 'bg-amc-blue/10 border-amc-blue/20'
                  )}
                >
                  <div className="font-semibold mb-1">{amb.id}</div>
                  <Badge
                    variant={
                      amb.status === 'available'
                        ? 'success'
                        : amb.status === 'en-route'
                          ? 'warning'
                          : 'info'
                    }
                    size="sm"
                  >
                    {amb.status}
                  </Badge>
                  <div className="text-xs text-white/50 mt-2">{amb.location}</div>
                  {amb.eta && <div className="text-xs text-amc-teal mt-1">ETA: {amb.eta}</div>}
                </div>
              ))}
            </div>
          </Card3D>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* ICU/HDU Bed Status */}
          <Card3D intensity={8} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amc-purple" />
              ICU/HDU Beds
            </h3>
            <div className="flex justify-center mb-4">
              <DonutChart
                value={icuBeds.filter((b) => b.status === 'available').length}
                max={icuBeds.length}
                size={100}
                strokeWidth={10}
                color="#00D26A"
                label="Available"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {icuBeds.map((bed) => (
                <div
                  key={bed.id}
                  className={clsx(
                    'p-3 rounded-xl text-center',
                    bed.status === 'available' && 'bg-amc-green/20 border border-amc-green/30',
                    bed.status === 'occupied' && 'bg-amc-red/20 border border-amc-red/30',
                    bed.status === 'maintenance' && 'bg-white/10 border border-white/20'
                  )}
                >
                  <div className="text-xs font-semibold mb-1">Bed {bed.id}</div>
                  <div className="text-[10px] text-white/50">
                    {bed.patient || bed.status}
                  </div>
                </div>
              ))}
            </div>
          </Card3D>

          {/* Emergency Contacts */}
          <Card3D intensity={8} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-amc-teal" />
              Quick Contacts
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Emergency Hotline', number: '112', icon: '🚨' },
                { name: 'Ambulance Dispatch', number: '+233 30 279 3333', icon: '🚑' },
                { name: 'Blood Bank', number: '+233 30 279 3334', icon: '🩸' },
                { name: 'Fire Service', number: '192', icon: '🔥' },
                { name: 'Police', number: '191', icon: '🚔' },
              ].map((contact, i) => (
                <button
                  key={i}
                  onClick={() => handleContactClick(contact)}
                  className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 group"
                >
                  <span className="text-xl">{contact.icon}</span>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">{contact.name}</div>
                    <div className="text-xs text-white/50">{contact.number}</div>
                  </div>
                  <Phone className="w-4 h-4 text-amc-green group-hover:animate-pulse" />
                </button>
              ))}
            </div>
          </Card3D>

          {/* Response Team */}
          <Card3D intensity={8} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-amc-blue" />
              On-Duty Response Team
            </h3>
            <div className="space-y-2">
              {[
                { name: 'Dr. Kwame Asante', role: 'Lead Physician', status: 'active' },
                { name: 'Abena Mensah', role: 'ER Nurse', status: 'active' },
                { name: 'Kofi Osei', role: 'Paramedic', status: 'en-route' },
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div>
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-white/50">{member.role}</div>
                  </div>
                  <Badge variant={member.status === 'active' ? 'success' : 'warning'} size="sm">
                    {member.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card3D>
        </div>
      </div>

      {/* Call Modal */}
      <Modal
        isOpen={showCallModal}
        onClose={() => {
          if (callInProgress) {
            endCall();
          } else {
            setShowCallModal(false);
            setSelectedContact(null);
          }
        }}
        title={callInProgress ? 'Call in Progress' : 'Contact'}
        size="sm"
      >
        {selectedContact && (
          <div className="text-center space-y-6">
            {/* Contact Icon */}
            <div className="flex justify-center">
              <div
                className={clsx(
                  'w-24 h-24 rounded-full flex items-center justify-center text-5xl transition-all',
                  callInProgress ? 'bg-amc-green/20 animate-pulse' : 'bg-white/10'
                )}
              >
                {selectedContact.icon}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold">{selectedContact.name}</h3>
              <p className="text-white/60">{selectedContact.number}</p>
            </div>

            {/* Call Duration */}
            {callInProgress && (
              <div className="text-3xl font-mono text-amc-green">
                {formatCallDuration(callDuration)}
              </div>
            )}

            {/* Call Actions */}
            <div className="flex gap-4 justify-center pt-4">
              {!callInProgress ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowCallModal(false);
                      setSelectedContact(null);
                    }}
                    className="w-32"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={startCall}
                    className="w-32 bg-amc-green hover:bg-amc-green/80"
                    icon={<PhoneCall className="w-4 h-4" />}
                  >
                    Call
                  </Button>
                </>
              ) : (
                <>
                  <button
                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    onClick={() => addToast('Muted', 'info')}
                  >
                    <MessageSquare className="w-6 h-6" />
                  </button>
                  <button
                    className="w-14 h-14 rounded-full bg-amc-red hover:bg-amc-red/80 flex items-center justify-center transition-colors"
                    onClick={endCall}
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                  <button
                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    onClick={() => addToast('Speaker on', 'info')}
                  >
                    <Phone className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Case Detail Modal */}
      <Modal
        isOpen={showCaseModal && selectedCase !== null}
        onClose={() => {
          setShowCaseModal(false);
          setSelectedCase(null);
        }}
        title={`Emergency Case: ${selectedCase?.id || ''}`}
        size="lg"
      >
        {selectedCase && (
          <div className="space-y-6">
            {/* Patient Info */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <Avatar name={selectedCase.patient} type="nurse" size="xl" />
              <div className="flex-1">
                <h2 className="text-xl font-bold">{selectedCase.patient}</h2>
                <p className="text-white/60">{selectedCase.age} years old</p>
              </div>
              <Badge
                variant={
                  selectedCase.priority === 'critical'
                    ? 'danger'
                    : selectedCase.priority === 'high'
                      ? 'warning'
                      : 'info'
                }
              >
                {selectedCase.priority.toUpperCase()}
              </Badge>
            </div>

            {/* Case Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-sm text-white/50 mb-1">Condition</div>
                <div className="font-semibold text-amc-red">{selectedCase.condition}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-sm text-white/50 mb-1">Status</div>
                <div className="font-semibold capitalize">{selectedCase.status}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-sm text-white/50 mb-1">Time in ER</div>
                <div className="font-semibold">{selectedCase.time}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-sm text-white/50 mb-1">Assigned Bed</div>
                <div className="font-semibold">ICU Bed 2</div>
              </div>
            </div>

            {/* Assigned Staff */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-amc-teal" />
                Assigned Team
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Dr. Kwame Asante', role: 'Lead Physician' },
                  { name: 'Abena Mensah', role: 'ER Nurse' },
                ].map((staff, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Avatar name={staff.name} type="doctor" size="sm" />
                      <div>
                        <div className="font-medium text-sm">{staff.name}</div>
                        <div className="text-xs text-white/50">{staff.role}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => handleContactClick({ name: staff.name, number: '+233 XX XXX XXXX', icon: '👨‍⚕️' })}>
                      <Phone className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  addToast('Transfer request initiated', 'info');
                }}
              >
                Transfer Patient
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  addToast('Code Blue activated!', 'error');
                  if (soundEnabled) playSound('alert');
                }}
              >
                Code Blue
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  addToast('Patient status updated', 'success');
                  setShowCaseModal(false);
                }}
              >
                Update Status
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Emergency;
