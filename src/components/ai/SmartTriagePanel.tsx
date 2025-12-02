import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  AlertTriangle,
  Activity,
  Heart,
  Thermometer,
  Wind,
  Droplets,
  Clock,
  ChevronRight,
  Shield,
  Zap,
  TrendingUp,
  Target,
  Loader2,
  CheckCircle,
  Info,
} from 'lucide-react';
import { clsx } from 'clsx';
import { analyzeTriagePriority, TriageResult, VitalSigns } from '../../services/aiService';
import Button from '../common/Button';

interface SmartTriagePanelProps {
  symptoms: string;
  age: number;
  gender: 'male' | 'female';
  onTriageComplete: (result: TriageResult) => void;
  onDepartmentSuggestion: (department: string) => void;
}

const SmartTriagePanel: React.FC<SmartTriagePanelProps> = ({
  symptoms,
  age,
  gender,
  onTriageComplete,
  onDepartmentSuggestion,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [showVitals, setShowVitals] = useState(false);
  const [vitals, setVitals] = useState<VitalSigns>({});
  const [analysisStep, setAnalysisStep] = useState(0);

  const analysisSteps = [
    { icon: Brain, label: 'Analyzing symptoms...', color: '#8B5CF6' },
    { icon: Activity, label: 'Assessing severity...', color: '#0066FF' },
    { icon: Shield, label: 'Calculating priority...', color: '#00D4AA' },
    { icon: Target, label: 'Recommending department...', color: '#FFD93D' },
  ];

  const runTriageAnalysis = async () => {
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);
    setTriageResult(null);
    setAnalysisStep(0);

    // Simulate analysis steps with animation
    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisStep(i);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Get actual result
    const result = analyzeTriagePriority(symptoms, age, gender, Object.keys(vitals).length > 0 ? vitals : undefined);

    setTriageResult(result);
    onTriageComplete(result);
    onDepartmentSuggestion(result.recommendedDepartment);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    // Auto-analyze when symptoms change (debounced)
    if (symptoms.length > 10) {
      const timer = setTimeout(() => {
        runTriageAnalysis();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [symptoms, age, vitals]);

  const getPriorityGradient = (level: string) => {
    switch (level) {
      case 'critical':
        return 'from-red-500 via-red-600 to-orange-500';
      case 'high':
        return 'from-orange-500 via-orange-600 to-yellow-500';
      case 'medium':
        return 'from-yellow-500 via-yellow-600 to-green-500';
      case 'low':
        return 'from-green-500 via-green-600 to-teal-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="w-6 h-6" />;
      case 'high':
        return <Zap className="w-6 h-6" />;
      case 'medium':
        return <Clock className="w-6 h-6" />;
      case 'low':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amc-purple via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-white flex items-center gap-2">
              Smart Triage AI
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amc-purple/20 border border-amc-purple/30">
                <Sparkles className="w-3 h-3 text-amc-purple" />
                <span className="text-[10px] font-medium text-amc-purple">BETA</span>
              </span>
            </h4>
            <p className="text-xs text-white/50">AI-powered priority assessment</p>
          </div>
        </div>

        {!isAnalyzing && triageResult && (
          <Button
            size="sm"
            variant="secondary"
            onClick={runTriageAnalysis}
            icon={<Activity className="w-4 h-4" />}
          >
            Re-analyze
          </Button>
        )}
      </div>

      {/* Vitals Input (Optional) */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <button
          onClick={() => setShowVitals(!showVitals)}
          className="w-full flex items-center justify-between text-sm"
        >
          <span className="flex items-center gap-2 text-white/70">
            <Activity className="w-4 h-4 text-amc-teal" />
            Add Vital Signs (Optional)
          </span>
          <ChevronRight
            className={clsx(
              'w-4 h-4 text-white/40 transition-transform',
              showVitals && 'rotate-90'
            )}
          />
        </button>

        {showVitals && (
          <div className="grid grid-cols-3 gap-3 mt-4 animate-fade-in">
            {/* Temperature */}
            <div className="space-y-1">
              <label className="flex items-center gap-1 text-xs text-white/50">
                <Thermometer className="w-3 h-3" />
                Temp (°C)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="37.0"
                className="input-field text-sm py-2"
                value={vitals.temperature || ''}
                onChange={(e) => setVitals({ ...vitals, temperature: parseFloat(e.target.value) || undefined })}
              />
            </div>

            {/* Heart Rate */}
            <div className="space-y-1">
              <label className="flex items-center gap-1 text-xs text-white/50">
                <Heart className="w-3 h-3" />
                Heart Rate
              </label>
              <input
                type="number"
                placeholder="72"
                className="input-field text-sm py-2"
                value={vitals.heartRate || ''}
                onChange={(e) => setVitals({ ...vitals, heartRate: parseInt(e.target.value) || undefined })}
              />
            </div>

            {/* O2 Saturation */}
            <div className="space-y-1">
              <label className="flex items-center gap-1 text-xs text-white/50">
                <Droplets className="w-3 h-3" />
                SpO2 (%)
              </label>
              <input
                type="number"
                placeholder="98"
                className="input-field text-sm py-2"
                value={vitals.oxygenSaturation || ''}
                onChange={(e) => setVitals({ ...vitals, oxygenSaturation: parseInt(e.target.value) || undefined })}
              />
            </div>

            {/* Blood Pressure Systolic */}
            <div className="space-y-1">
              <label className="flex items-center gap-1 text-xs text-white/50">
                <Activity className="w-3 h-3" />
                BP Systolic
              </label>
              <input
                type="number"
                placeholder="120"
                className="input-field text-sm py-2"
                value={vitals.bloodPressureSystolic || ''}
                onChange={(e) => setVitals({ ...vitals, bloodPressureSystolic: parseInt(e.target.value) || undefined })}
              />
            </div>

            {/* Blood Pressure Diastolic */}
            <div className="space-y-1">
              <label className="flex items-center gap-1 text-xs text-white/50">
                <Activity className="w-3 h-3" />
                BP Diastolic
              </label>
              <input
                type="number"
                placeholder="80"
                className="input-field text-sm py-2"
                value={vitals.bloodPressureDiastolic || ''}
                onChange={(e) => setVitals({ ...vitals, bloodPressureDiastolic: parseInt(e.target.value) || undefined })}
              />
            </div>

            {/* Respiratory Rate */}
            <div className="space-y-1">
              <label className="flex items-center gap-1 text-xs text-white/50">
                <Wind className="w-3 h-3" />
                Resp Rate
              </label>
              <input
                type="number"
                placeholder="16"
                className="input-field text-sm py-2"
                value={vitals.respiratoryRate || ''}
                onChange={(e) => setVitals({ ...vitals, respiratoryRate: parseInt(e.target.value) || undefined })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Analysis Animation */}
      {isAnalyzing && (
        <div className="p-6 rounded-xl bg-gradient-to-br from-amc-purple/10 via-purple-900/5 to-pink-900/10 border border-amc-purple/20 animate-pulse">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amc-purple to-pink-500 animate-spin-slow flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-amc-darker flex items-center justify-center">
                  <Brain className="w-6 h-6 text-amc-purple animate-pulse" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amc-green flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              {analysisSteps.map((step, i) => {
                const StepIcon = step.icon;
                const isActive = i === analysisStep;
                const isComplete = i < analysisStep;

                return (
                  <div
                    key={i}
                    className={clsx(
                      'flex items-center gap-2 text-sm transition-all duration-300',
                      isActive && 'text-white scale-105',
                      isComplete && 'text-white/40',
                      !isActive && !isComplete && 'text-white/20'
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle className="w-4 h-4 text-amc-green" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: step.color }} />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Triage Result */}
      {triageResult && !isAnalyzing && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Priority Score Card */}
          <div
            className="relative overflow-hidden rounded-2xl p-6"
            style={{ background: `${triageResult.priorityColor}10` }}
          >
            {/* Background gradient */}
            <div
              className={clsx(
                'absolute inset-0 opacity-20 bg-gradient-to-br',
                getPriorityGradient(triageResult.priorityLevel)
              )}
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Priority indicator */}
                <div
                  className={clsx(
                    'w-20 h-20 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br shadow-lg',
                    getPriorityGradient(triageResult.priorityLevel)
                  )}
                >
                  <span className="text-3xl font-bold text-white">{triageResult.priorityScore}</span>
                  <span className="text-[10px] font-medium text-white/80 uppercase">/10</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getPriorityIcon(triageResult.priorityLevel)}
                    <span
                      className="text-2xl font-bold uppercase"
                      style={{ color: triageResult.priorityColor }}
                    >
                      {triageResult.priorityLevel}
                    </span>
                  </div>
                  <div className="text-sm text-white/60">Priority Level</div>
                </div>
              </div>

              {/* AI Confidence */}
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <TrendingUp className="w-4 h-4 text-amc-teal" />
                  <span className="text-xl font-bold text-amc-teal">{triageResult.aiConfidence}%</span>
                </div>
                <div className="text-xs text-white/50">AI Confidence</div>
              </div>
            </div>

            {/* Alerts */}
            {triageResult.alerts.length > 0 && (
              <div className="mt-4 space-y-2">
                {triageResult.alerts.map((alert, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10"
                  >
                    <AlertTriangle
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: triageResult.priorityColor }}
                    />
                    <span className="text-sm font-medium">{alert}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Estimated Wait Time */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2 text-white/50 text-xs mb-2">
                <Clock className="w-4 h-4" />
                Estimated Wait Time
              </div>
              <div className="text-2xl font-bold text-white">
                {triageResult.estimatedWaitTime === 0 ? (
                  <span className="text-amc-red">IMMEDIATE</span>
                ) : (
                  <span>~{triageResult.estimatedWaitTime} min</span>
                )}
              </div>
            </div>

            {/* Recommended Department */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2 text-white/50 text-xs mb-2">
                <Target className="w-4 h-4" />
                Recommended Department
              </div>
              <div className="text-lg font-bold text-amc-teal">
                {triageResult.recommendedDepartment}
              </div>
            </div>
          </div>

          {/* Reasoning */}
          {triageResult.reasoning.length > 0 && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-2 text-white/50 text-xs mb-3">
                <Brain className="w-4 h-4" />
                AI Analysis Reasoning
              </div>
              <ul className="space-y-2">
                {triageResult.reasoning.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <ChevronRight className="w-4 h-4 text-amc-purple flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-2 text-[11px] text-white/40 px-2">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>
              This AI assessment is for guidance only. Always apply clinical judgment.
              The final triage decision should be made by qualified medical staff.
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isAnalyzing && !triageResult && symptoms.length < 10 && (
        <div className="p-8 rounded-xl bg-white/[0.02] border border-white/[0.05] border-dashed text-center">
          <div className="w-16 h-16 rounded-full bg-amc-purple/10 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-amc-purple/50" />
          </div>
          <p className="text-white/50 text-sm">
            Enter symptoms to receive AI-powered triage assessment
          </p>
          <p className="text-white/30 text-xs mt-2">
            Describe symptoms in detail for better accuracy
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartTriagePanel;
