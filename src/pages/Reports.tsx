import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, Users, Activity, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import AnimatedLineChart from '../components/charts/AnimatedLineChart';
import BarChart from '../components/charts/BarChart';
import DonutChart from '../components/charts/DonutChart';
import { chartData, departmentData } from '../data/mockData';
import { useAppStore } from '../stores/appStore';
import { formatCurrency } from '../utils/formatters';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('week');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { addToast } = useAppStore();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (!customStartDate || (customStartDate && customEndDate)) {
      setCustomStartDate(dateStr);
      setCustomEndDate('');
    } else {
      if (new Date(dateStr) < new Date(customStartDate)) {
        setCustomEndDate(customStartDate);
        setCustomStartDate(dateStr);
      } else {
        setCustomEndDate(dateStr);
      }
    }
  };

  const isInRange = (day: number) => {
    if (!customStartDate) return false;
    const dateStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const current = new Date(dateStr);
    const start = new Date(customStartDate);
    const end = customEndDate ? new Date(customEndDate) : null;

    if (!end) return dateStr === customStartDate;
    return current >= start && current <= end;
  };

  const applyCustomRange = () => {
    if (customStartDate && customEndDate) {
      setDateRange('custom');
      setShowDatePicker(false);
      addToast(`Reports filtered from ${formatDateForDisplay(customStartDate)} to ${formatDateForDisplay(customEndDate)}`, 'success');
    } else {
      addToast('Please select both start and end dates', 'error');
    }
  };

  const metrics = [
    { label: 'Avg Wait Time', value: '12 min', trend: '-8%', up: false, icon: Clock, color: '#00D4AA' },
    { label: 'Patient Satisfaction', value: '94%', trend: '+3%', up: true, icon: TrendingUp, color: '#0066FF' },
    { label: 'Staff Efficiency', value: '97%', trend: '+5%', up: true, icon: Activity, color: '#667EEA' },
    { label: 'Overtime Hours', value: '-12%', trend: '-12%', up: false, icon: Users, color: '#FF6B35' },
  ];

  const revenueByDept = departmentData.slice(0, 6).map((d) => ({
    label: d.name.slice(0, 6),
    value: Math.floor(Math.random() * 50000) + 20000,
    color: d.color,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex bg-white/5 rounded-xl p-1">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                dateRange === range
                  ? 'bg-gradient-to-r from-amc-teal to-amc-blue text-white'
                  : 'text-white/50 hover:text-white/70'
              )}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {dateRange === 'custom' && customStartDate && customEndDate && (
            <span className="text-sm text-white/60 px-3 py-1 bg-white/5 rounded-lg">
              {formatDateForDisplay(customStartDate)} - {formatDateForDisplay(customEndDate)}
            </span>
          )}
          <Button
            variant="secondary"
            icon={<Calendar className="w-4 h-4" />}
            onClick={() => setShowDatePicker(true)}
          >
            Custom Range
          </Button>
          <Button
            icon={<Download className="w-4 h-4" />}
            onClick={() => addToast('Report exported to PDF', 'success')}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <Card3D
              key={i}
              intensity={12}
              className="glass-card p-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${metric.color}20`, border: `1px solid ${metric.color}30` }}
                >
                  <Icon className="w-6 h-6" style={{ color: metric.color }} />
                </div>
                <span
                  className={clsx(
                    'text-sm font-semibold',
                    metric.up ? 'text-amc-green' : 'text-amc-red'
                  )}
                >
                  {metric.trend}
                </span>
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: metric.color }}>
                {metric.value}
              </div>
              <div className="text-sm text-white/50">{metric.label}</div>
            </Card3D>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Coverage Trend */}
        <Card3D intensity={8} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amc-teal" />
            Coverage Trend
          </h3>
          <AnimatedLineChart data={chartData.coverage} color="#00D4AA" height={200} />
        </Card3D>

        {/* Shift Distribution */}
        <Card3D intensity={8} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amc-blue" />
            Shift Distribution
          </h3>
          <AnimatedLineChart data={chartData.shifts} color="#0066FF" height={200} />
        </Card3D>

        {/* Patient Flow */}
        <Card3D intensity={8} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-amc-purple" />
            Patient Flow
          </h3>
          <AnimatedLineChart data={chartData.patients} color="#667EEA" height={200} />
        </Card3D>

        {/* Revenue by Department */}
        <Card3D intensity={8} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amc-green" />
            Revenue by Department
          </h3>
          <BarChart data={revenueByDept} height={200} />
        </Card3D>
      </div>

      {/* Performance Summary */}
      <Card3D intensity={8} className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-6">Performance Summary</h3>
        <div className="grid grid-cols-4 gap-8">
          {[
            { label: 'Total Patients', value: '89,432', subtext: 'This year', color: '#00D4AA' },
            { label: 'Avg Daily Visits', value: '245', subtext: 'Per day', color: '#0066FF' },
            { label: 'Staff Utilization', value: '87%', subtext: 'Efficiency', color: '#667EEA' },
            { label: 'Total Revenue', value: formatCurrency(2450000), subtext: 'YTD', color: '#00D26A' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <DonutChart
                value={parseInt(item.value.replace(/[^0-9]/g, '')) || 87}
                max={100}
                size={100}
                strokeWidth={10}
                color={item.color}
                showLabel={false}
              />
              <div className="mt-4">
                <div className="text-xl font-bold" style={{ color: item.color }}>
                  {item.value}
                </div>
                <div className="text-sm text-white/50">{item.label}</div>
                <div className="text-xs text-white/30">{item.subtext}</div>
              </div>
            </div>
          ))}
        </div>
      </Card3D>

      {/* Custom Date Range Picker Modal */}
      <Modal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        title="Select Date Range"
        size="md"
      >
        <div className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-lg">
              {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
            </span>
            <button
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs text-white/50 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first of the month */}
            {Array.from({ length: getFirstDayOfMonth(selectedMonth) }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: getDaysInMonth(selectedMonth) }).map((_, i) => {
              const day = i + 1;
              const inRange = isInRange(day);
              const dateStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isStart = dateStr === customStartDate;
              const isEnd = dateStr === customEndDate;

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={clsx(
                    'h-10 rounded-lg text-sm font-medium transition-all',
                    inRange
                      ? isStart || isEnd
                        ? 'bg-gradient-to-r from-amc-teal to-amc-blue text-white'
                        : 'bg-amc-teal/20 text-white'
                      : 'hover:bg-white/10 text-white/70'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Selected Range Display */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl mt-4">
            <div>
              <span className="text-xs text-white/50">Start Date</span>
              <div className="font-medium">{formatDateForDisplay(customStartDate) || 'Select...'}</div>
            </div>
            <div className="text-white/30">→</div>
            <div className="text-right">
              <span className="text-xs text-white/50">End Date</span>
              <div className="font-medium">{formatDateForDisplay(customEndDate) || 'Select...'}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setCustomStartDate('');
                setCustomEndDate('');
              }}
            >
              Clear
            </Button>
            <Button className="flex-1" onClick={applyCustomRange}>
              Apply Range
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Add missing import
const Clock = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export default Reports;
