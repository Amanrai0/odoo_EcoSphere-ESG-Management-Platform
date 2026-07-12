import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
  LayoutDashboard,
  Leaf,
  Users,
  Shield,
  Trophy,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Sparkles,
  PlusCircle,
  Zap,
  AlertTriangle,
  Calculator,
  Award,
  Sliders,
  DownloadCloud,
  Check,
  X,
  Info,
  TrendingUp,
  TrendingDown,
  ShieldAlert
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import './styles.css';

// Register Chart.js Modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API = window.location.hostname === 'localhost' ? 'http://localhost:8000/api/v1' : 'http://127.0.0.1:8000/api/v1';

function cookie(name) {
  return document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1] || '';
}

function App() {
  // ==================== INITIAL STATES ====================
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Assumed true if cookies match
  const [activeView, setActiveView] = useState('dashboard');
  const [subViewTab, setSubViewTab] = useState('all');
  const [filterQuery, setFilterQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [toastQueue, setToastQueue] = useState([]);

  // Live Backend States
  const [backendDashboard, setBackendDashboard] = useState(null);
  const [backendIssues, setBackendIssues] = useState([]);
  const [backendPolicies, setBackendPolicies] = useState([]);
  const [backendNotifications, setBackendNotifications] = useState([]);
  const [backendAuthError, setBackendAuthError] = useState('');

  // Database Mock Fallbacks (for environmental & social modules)
  const [currentUser, setCurrentUser] = useState({
    id: "jane-doe-uuid",
    name: "Jane Doe",
    email: "jane.doe@company.com",
    role: "employee",
    department_id: "logistics-uuid",
    xp: 450,
    points_balance: 450,
    badges: ["Green Champion"]
  });

  const [departments, setDepartments] = useState([
    { id: "logistics-uuid", name: "Logistics", code: "LOG-01", employee_count: 45 },
    { id: "mfg-uuid", name: "Manufacturing", code: "MFG-02", employee_count: 80 },
    { id: "corporate-uuid", name: "Corporate", code: "CORP-03", employee_count: 15 }
  ]);

  const [emissionFactors] = useState([
    { id: "elec-factor", activity_source: "electricity", factor: 0.42, unit: "kg_co2_per_kwh", status: "active" },
    { id: "gas-factor", activity_source: "gasoline", factor: 2.31, unit: "kg_co2_per_liter", status: "active" },
    { id: "steel-factor", activity_source: "steel_manufacturing", factor: 1.85, unit: "kg_co2_per_kg", status: "active" },
    { id: "flight-factor", activity_source: "fleet", factor: 0.12, unit: "kg_co2_per_km", status: "active" }
  ]);

  const [environmentalGoals, setEnvironmentalGoals] = useState([
    { id: "goal-1", name: "Q3 Logistics Fleet Reduction", department_id: "logistics-uuid", target_value: 15000, current_value: 12100, deadline: "2026-09-30", status: "active" },
    { id: "goal-2", name: "Q3 Mfg Steel Savings", department_id: "mfg-uuid", target_value: 80000, current_value: 78000, deadline: "2026-09-30", status: "active" }
  ]);

  const [carbonTransactions, setCarbonTransactions] = useState([
    { id: "tx-1", erp_reference: "ERP-101", department_id: "logistics-uuid", source_type: "fleet", activity_amount: 3500, calculated_emissions: 8085, transaction_date: "2026-06-15T10:00:00Z" },
    { id: "tx-2", erp_reference: "ERP-102", department_id: "mfg-uuid", source_type: "manufacturing", activity_amount: 18000, calculated_emissions: 33300, transaction_date: "2026-06-20T14:30:00Z" },
    { id: "tx-3", erp_reference: "ERP-103", department_id: "corporate-uuid", source_type: "purchase", activity_amount: 12000, calculated_emissions: 5040, transaction_date: "2026-07-02T09:15:00Z" }
  ]);

  const [csrActivities, setCsrActivities] = useState([
    { id: "csr-1", title: "Tree Plantation Drive", description: "Planting saplings in the local community park.", category_id: "cat-csr", points_awarded: 50, max_participants: 20, date: "2026-07-20T08:00:00Z", status: "active" },
    { id: "csr-2", title: "Blood Donation Camp", description: "Supporting national healthcare organizations.", category_id: "cat-csr", points_awarded: 30, max_participants: 30, date: "2026-07-24T09:00:00Z", status: "active" },
    { id: "csr-3", title: "Climate Cleanup", description: "Clearing waste along the riverside depot.", category_id: "cat-csr", points_awarded: 100, max_participants: 25, date: "2026-07-15T08:00:00Z", status: "active" },
    { id: "csr-4", title: "ESG Workshop", description: "Understanding daily footprint minimization guidelines.", category_id: "cat-csr", points_awarded: 40, max_participants: 15, date: "2026-07-10T11:00:00Z", status: "completed" }
  ]);

  const [participations, setParticipations] = useState([
    { id: "part-1", employee_name: "John Smith", activity_title: "Tree Plantation Drive", activity_id: "csr-1", date_logged: "2026-07-11T12:00:00Z", points_earned: 50, proof_url: "tree_planting_proof.jpg", approval_status: "pending" },
    { id: "part-2", employee_name: "Jane Doe", activity_title: "ESG Workshop", activity_id: "csr-4", date_logged: "2026-07-10T13:30:00Z", points_earned: 40, proof_url: "workshop_cert.pdf", approval_status: "approved" }
  ]);

  const [challenges] = useState([
    { id: "chal-1", title: "Sustainability Sprint", description: "Submit 5 days of zero-plastic lunches.", xp_reward: 200, difficulty: "hard", deadline: "2026-07-30T17:00:00Z" },
    { id: "chal-2", title: "Decarbonize Challenge", description: "Switch to electric or cycle commute for a week.", xp_reward: 150, difficulty: "medium", deadline: "2026-08-15T17:00:00Z" }
  ]);

  const [badges] = useState([
    { id: "badge-1", name: "Green Champion", description: "Accumulated more than 300 XP in CSR tasks." }
  ]);

  const [rewards, setRewards] = useState([
    { id: "rew-1", name: "Eco-friendly Water Bottle", description: "Vacuum-insulated double-wall stainless steel flask.", points_required: 500, stock: 12, status: "active" },
    { id: "rew-2", name: "Solar Phone Charger", description: "Compact outdoor solar cell panel bank.", points_required: 1200, stock: 5, status: "active" }
  ]);

  const [settings, setSettings] = useState({
    auto_emission_calculation: true,
    evidence_requirement: true,
    badge_auto_award: true,
    escalate_overdue: true,
    weight_environmental: 0.40,
    weight_social: 0.30,
    weight_governance: 0.30
  });

  const [activities, setActivities] = useState([
    { id: 1, text: "Carbon Transaction ERP-103 created by Jane Doe", type: "env", time: "2 hours ago" }
  ]);

  const [employees, setEmployees] = useState([
    { id: "jane-doe-uuid", name: "Jane Doe", xp: 450, department: "Logistics" },
    { id: "john-smith-id", name: "John Smith", xp: 320, department: "Logistics" }
  ]);

  // Form inputs
  const [carbonRef, setCarbonRef] = useState('');
  const [carbonSource, setCarbonSource] = useState('elec-factor');
  const [carbonDept, setCarbonDept] = useState('logistics-uuid');
  const [carbonAmount, setCarbonAmount] = useState('');

  const [goalName, setGoalName] = useState('');
  const [goalDept, setGoalDept] = useState('logistics-uuid');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('2026-09-30');

  const [compDesc, setCompDesc] = useState('');
  const [compSeverity, setCompSeverity] = useState('high');
  const [compDeptId, setCompDeptId] = useState('');
  const [compDueDate, setCompDueDate] = useState('2026-07-25');

  const [csrTitle, setCsrTitle] = useState('');
  const [csrDesc, setCsrDesc] = useState('');
  const [csrPoints, setCsrPoints] = useState(50);
  const [csrLimit, setCsrLimit] = useState(15);
  const [csrDate, setCsrDate] = useState('2026-07-28');

  const [proofUrl, setProofUrl] = useState('');
  const [proofActivityId, setProofActivityId] = useState('');

  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptCount, setDeptCount] = useState(12);

  const [quickCalcSource, setQuickCalcSource] = useState('elec-factor');
  const [quickCalcAmount, setQuickCalcAmount] = useState('');
  const [quickCalcDept, setQuickCalcDept] = useState('logistics-uuid');

  const [weightEnv, setWeightEnv] = useState(40);
  const [weightSoc, setWeightSoc] = useState(30);
  const [weightGov, setWeightGov] = useState(30);

  // Custom Report Form
  const [reportDeptFilter, setReportDeptFilter] = useState('all');
  const [reportStartDate, setReportStartDate] = useState('2026-01-01');
  const [reportEndDate, setReportEndDate] = useState('2026-07-12');
  const [repEnvCheck, setRepEnvCheck] = useState(true);
  const [repSocCheck, setRepSocCheck] = useState(true);
  const [repGovCheck, setRepGovCheck] = useState(true);
  const [reportFormat, setReportFormat] = useState('pdf');

  // ==================== LOAD BACKEND DATA ====================
  const loadBackend = async () => {
    try {
      const [dashboardData, issueData, policyData, notificationsData] = await Promise.all(
        ['dashboard/', 'compliance-issues/', 'policies/', 'notifications/'].map(async (path) => {
          const result = await fetch(`${API}/${path}`, { credentials: 'include' });
          if (!result.ok) throw new Error('Sign in through Django admin first.');
          return result.json();
        })
      );
      setBackendDashboard(dashboardData);
      setBackendIssues(issueData);
      setBackendPolicies(policyData);
      setBackendNotifications(notificationsData);
      setBackendAuthError('');
      
      // Update employee list using policy names or user profile
      if (dashboardData.departments && dashboardData.departments.length > 0) {
        setCompDeptId(dashboardData.departments[0].id);
      }
    } catch (loadError) {
      setBackendAuthError(loadError.message);
      setBackendDashboard(null);
    }
  };

  useEffect(() => {
    loadBackend();
  }, []);

  // ==================== TOAST DISPATCHER ====================
  const triggerToast = (message, type = "env") => {
    const id = Date.now();
    setToastQueue(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToastQueue(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // ==================== METRICS CALCULATIONS ====================
  const scores = useMemo(() => {
    // 1. Environmental
    const totalEmissions = carbonTransactions.reduce((acc, curr) => acc + curr.calculated_emissions, 0);
    const totalTargetGoals = environmentalGoals.reduce((acc, curr) => acc + curr.target_value, 0);
    let envScore = 50;
    if (totalTargetGoals > 0) {
      envScore = Math.max(0, Math.min(100, Math.round(100 * (1 - (totalEmissions / totalTargetGoals)))));
    }
    
    // 2. Social
    const approvedParticipationsCount = participations.filter(p => p.approval_status === "approved").length;
    const totalEmployees = departments.reduce((acc, curr) => acc + curr.employee_count, 0);
    const totalAcknowledgeTargets = totalEmployees * 2;
    let socialScore = 65;
    if (totalEmployees > 0 && totalAcknowledgeTargets > 0) {
      const partRatio = approvedParticipationsCount / totalEmployees;
      socialScore = Math.min(100, Math.round((0.6 * partRatio + 0.4 * 0.5) * 100));
    }
    
    // 3. Governance (Pull from live backend if logged in)
    let govScore = 100;
    let openCount = 0;
    let overdueCount = 0;
    if (backendDashboard) {
      govScore = Math.round(backendDashboard.governance_score);
      openCount = backendDashboard.open_issues;
      overdueCount = backendDashboard.overdue_issues;
    } else {
      // Fallback
      govScore = 80;
      openCount = 1;
      overdueCount = 1;
    }
    
    // 4. Overall
    const wEnv = settings.weight_environmental;
    const wSoc = settings.weight_social;
    const wGov = settings.weight_governance;
    const overallScore = Math.round((wEnv * envScore) + (wSoc * socialScore) + (wGov * govScore));
    
    return { envScore, socialScore, govScore, overallScore, openCount, overdueCount };
  }, [carbonTransactions, environmentalGoals, participations, departments, settings, backendDashboard]);

  // Compute departmental scores
  const departmentScores = useMemo(() => {
    if (backendDashboard && backendDashboard.departments) {
      // Hydrate live backend departments
      return backendDashboard.departments.map(d => {
        const mockEnv = d.name.toLowerCase().includes("logistics") ? 80 : 65;
        const mockSoc = d.name.toLowerCase().includes("logistics") ? 70 : 85;
        const total = Math.round((settings.weight_environmental * mockEnv) + (settings.weight_social * mockSoc) + (settings.weight_governance * parseFloat(d.score)));
        return {
          id: d.id,
          name: d.name,
          env: mockEnv,
          soc: mockSoc,
          gov: Math.round(d.score),
          total
        };
      }).sort((a, b) => b.total - a.total);
    }

    // Fallback to pure mock
    return departments.map(dept => {
      const env = dept.code === 'LOG-01' ? 80 : (dept.code === 'MFG-02' ? 50 : 95);
      const soc = dept.code === 'LOG-01' ? 70 : (dept.code === 'MFG-02' ? 60 : 85);
      const gov = dept.code === 'LOG-01' ? 90 : (dept.code === 'MFG-02' ? 80 : 95);
      const total = Math.round((settings.weight_environmental * env) + (settings.weight_social * soc) + (settings.weight_governance * gov));
      return { id: dept.id, name: dept.name, env, soc, gov, total };
    }).sort((a, b) => b.total - a.total);
  }, [departments, settings, backendDashboard]);

  // Charts
  const lineChartData = useMemo(() => {
    const sums = { "May": 28400, "June": 41385, "July": 5040 };
    const julyTxs = carbonTransactions.filter(t => new Date(t.transaction_date).getMonth() === 6);
    sums["July"] = julyTxs.reduce((acc, curr) => acc + curr.calculated_emissions, 0);

    return {
      labels: Object.keys(sums),
      datasets: [{
        label: 'CO₂ Emissions (kg)',
        data: Object.values(sums),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3
      }]
    };
  }, [carbonTransactions]);

  const barChartData = useMemo(() => {
    const labels = departmentScores.map(d => d.name);
    const envs = departmentScores.map(d => d.env);
    const socs = departmentScores.map(d => d.soc);
    const govs = departmentScores.map(d => d.gov);

    return {
      labels,
      datasets: [
        { label: 'Environmental', data: envs, backgroundColor: '#10b981' },
        { label: 'Social', data: socs, backgroundColor: '#0ea5e9' },
        { label: 'Governance', data: govs, backgroundColor: '#8b5cf6' }
      ]
    };
  }, [departmentScores]);

  // ==================== ACTIONS & EVENT HANDLERS ====================
  const logCarbonData = (e) => {
    e.preventDefault();
    const factorObj = emissionFactors.find(f => f.id === carbonSource);
    const calculatedEmissions = Math.round(parseFloat(carbonAmount) * factorObj.factor);
    
    const newTx = {
      id: `tx-${Date.now()}`,
      erp_reference: carbonRef,
      department_id: carbonDept,
      source_type: factorObj.activity_source,
      activity_amount: parseFloat(carbonAmount),
      calculated_emissions: calculatedEmissions,
      transaction_date: new Date().toISOString()
    };
    
    setCarbonTransactions(prev => [newTx, ...prev]);

    setEnvironmentalGoals(prev => prev.map(goal => {
      if (goal.department_id === carbonDept && goal.status === 'active') {
        const newVal = goal.current_value + calculatedEmissions;
        const status = newVal >= goal.target_value ? 'missed' : 'active';
        if (status === 'missed') {
          triggerToast(`Goal "${goal.name}" exceeded target limit!`, "env");
        }
        return { ...goal, current_value: newVal, status };
      }
      return goal;
    }));

    setActivities(prev => [{
      id: Date.now(),
      text: `Carbon Log ${carbonRef} registered (+${calculatedEmissions} kg CO₂e)`,
      type: "env",
      time: "Just now"
    }, ...prev]);

    setCurrentUser(prev => ({ ...prev, xp: prev.xp + 10, points_balance: prev.points_balance + 10 }));
    setActiveModal(null);
    setCarbonRef('');
    setCarbonAmount('');
    triggerToast(`Logged ${calculatedEmissions} kg CO₂e successfully. +10 XP awarded!`, "env");
  };

  const recordQuickCalc = (e) => {
    e.preventDefault();
    const factorObj = emissionFactors.find(f => f.id === quickCalcSource);
    const calculatedEmissions = Math.round(parseFloat(quickCalcAmount) * factorObj.factor);
    const ref = "ERP-" + Math.floor(100 + Math.random() * 900);

    const newTx = {
      id: `tx-${Date.now()}`,
      erp_reference: ref,
      department_id: quickCalcDept,
      source_type: factorObj.activity_source,
      activity_amount: parseFloat(quickCalcAmount),
      calculated_emissions: calculatedEmissions,
      transaction_date: new Date().toISOString()
    };

    setCarbonTransactions(prev => [newTx, ...prev]);

    setEnvironmentalGoals(prev => prev.map(goal => {
      if (goal.department_id === quickCalcDept && goal.status === 'active') {
        const newVal = goal.current_value + calculatedEmissions;
        const status = newVal >= goal.target_value ? 'missed' : 'active';
        if (status === 'missed') {
          triggerToast(`Goal "${goal.name}" exceeded target limit!`, "env");
        }
        return { ...goal, current_value: newVal, status };
      }
      return goal;
    }));

    setActivities(prev => [{
      id: Date.now(),
      text: `Quick Carbon Log ${ref} registered (+${calculatedEmissions} kg CO₂e)`,
      type: "env",
      time: "Just now"
    }, ...prev]);

    setCurrentUser(prev => ({ ...prev, xp: prev.xp + 10, points_balance: prev.points_balance + 10 }));
    setQuickCalcAmount('');
    triggerToast(`Logged ${calculatedEmissions} kg CO₂e successfully. +10 XP awarded!`, "env");
  };

  // Live Backend: Acknowledge Policy
  const handleAcknowledgePolicy = async (policyId) => {
    if (!backendDashboard) {
      // Local fallback
      triggerToast("Mock policy acknowledged!", "gov");
      return;
    }
    try {
      const response = await fetch(`${API}/policies/${policyId}/acknowledge/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-CSRFToken': cookie('csrftoken') }
      });
      if (response.ok) {
        triggerToast("Policy acknowledged on Django backend!", "gov");
        loadBackend();
      }
    } catch (e) {
      triggerToast("Error communicating with backend.", "danger");
    }
  };

  // Live Backend: Resolve Compliance Violation
  const handleResolveIssue = async (issueId) => {
    if (!backendDashboard) {
      // Local fallback
      triggerToast("Mock compliance issue resolved!", "gov");
      return;
    }
    try {
      const response = await fetch(`${API}/compliance-issues/${issueId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': cookie('csrftoken')
        },
        body: JSON.stringify({ status: 'resolved' })
      });
      if (response.ok) {
        triggerToast("Compliance issue marked resolved on Django!", "gov");
        loadBackend();
      }
    } catch (e) {
      triggerToast("Failed to update status on backend.", "danger");
    }
  };

  // Live Backend: Add Compliance Violation
  const handleAddComplianceIssue = async (e) => {
    e.preventDefault();
    if (!backendDashboard) {
      // Local fallback
      const mockIssue = {
        id: Date.now(),
        audit: "Internal Audit",
        department: departments.find(d => d.id === carbonDept)?.name || "Logistics",
        severity: compSeverity,
        description: compDesc,
        owner: "Jane Doe",
        due_date: compDueDate,
        status: "open"
      };
      setBackendIssues(prev => [mockIssue, ...prev]);
      setActiveModal(null);
      setCompDesc('');
      triggerToast("Mock compliance issue logged locally.", "gov");
      return;
    }

    try {
      // Read current admin user or default ID
      const response = await fetch(`${API}/compliance-issues/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': cookie('csrftoken')
        },
        body: JSON.stringify({
          audit_id: 1, // Default seed ID
          department_id: compDeptId || backendDashboard.departments[0].id,
          severity: compSeverity,
          description: compDesc,
          owner_id: 1, // Default admin seed
          due_date: compDueDate
        })
      });
      if (response.ok) {
        triggerToast("Violation logged on Django database!", "gov");
        setActiveModal(null);
        setCompDesc('');
        loadBackend();
      } else {
        triggerToast("Failed to create issue. Ensure user ID 1 exists.", "danger");
      }
    } catch (e) {
      triggerToast("Error connecting to Django API.", "danger");
    }
  };

  // Local Add Goal
  const createGoal = (e) => {
    e.preventDefault();
    const newGoal = {
      id: `goal-${Date.now()}`,
      name: goalName,
      department_id: goalDept,
      target_value: parseFloat(goalTarget),
      current_value: 0,
      deadline: goalDeadline,
      status: "active"
    };
    setEnvironmentalGoals(prev => [newGoal, ...prev]);
    setActiveModal(null);
    setGoalName('');
    setGoalTarget('');
    triggerToast(`Goal "${goalName}" established.`, "env");
  };

  const createCsrActivity = (e) => {
    e.preventDefault();
    const newCsr = {
      id: `csr-${Date.now()}`,
      title: csrTitle,
      description: csrDesc,
      category_id: "cat-csr",
      points_awarded: parseInt(csrPoints),
      max_participants: parseInt(csrLimit),
      date: new Date(csrDate).toISOString(),
      status: "active"
    };
    setCsrActivities(prev => [newCsr, ...prev]);
    setActiveModal(null);
    setCsrTitle('');
    setCsrDesc('');
    triggerToast(`CSR activity scheduled.`, "soc");
  };

  const joinCsr = (csrId) => {
    const csr = csrActivities.find(c => c.id === csrId);
    if (settings.evidence_requirement) {
      setProofActivityId(csrId);
      setActiveModal('proof');
    } else {
      const newPart = {
        id: `part-${Date.now()}`,
        employee_name: currentUser.name,
        activity_title: csr.title,
        activity_id: csrId,
        date_logged: new Date().toISOString(),
        points_earned: csr.points_awarded,
        proof_url: null,
        approval_status: "approved"
      };
      setParticipations(prev => [newPart, ...prev]);
      setCurrentUser(prev => ({
        ...prev,
        points_balance: prev.points_balance + csr.points_awarded,
        xp: prev.xp + csr.points_awarded
      }));
      triggerToast(`Joined "${csr.title}"! +${csr.points_awarded} Points.`, "soc");
    }
  };

  const submitProof = (e) => {
    e.preventDefault();
    const csr = csrActivities.find(c => c.id === proofActivityId);
    const newPart = {
      id: `part-${Date.now()}`,
      employee_name: currentUser.name,
      activity_title: csr.title,
      activity_id: proofActivityId,
      date_logged: new Date().toISOString(),
      points_earned: csr.points_awarded,
      proof_url: proofUrl,
      approval_status: "pending"
    };
    setParticipations(prev => [newPart, ...prev]);
    setActiveModal(null);
    setProofUrl('');
    triggerToast(`Evidence uploaded for "${csr.title}". Pending approval.`, "soc");
  };

  const moderateParticipation = (partId, decision) => {
    setParticipations(prev => prev.map(p => {
      if (p.id === partId) {
        if (decision === 'approved' && p.employee_name === currentUser.name) {
          setCurrentUser(curr => ({ ...curr, xp: curr.xp + p.points_earned, points_balance: curr.points_balance + p.points_earned }));
        }
        return { ...p, approval_status: decision };
      }
      return p;
    }));
  };

  const saveWeights = (e) => {
    e.preventDefault();
    if (parseFloat(weightEnv) + parseFloat(weightSoc) + parseFloat(weightGov) !== 100) {
      triggerToast("Total weights must sum to exactly 100%!", "gov");
      return;
    }
    setSettings(prev => ({
      ...prev,
      weight_environmental: parseFloat(weightEnv) / 100,
      weight_social: parseFloat(weightSoc) / 100,
      weight_governance: parseFloat(weightGov) / 100
    }));
    triggerToast("Calculation weights saved!", "gov");
  };

  // Preview calculator quantity labels
  const activeCalcUnitLabel = useMemo(() => {
    const factor = emissionFactors.find(f => f.id === quickCalcSource);
    return factor ? factor.unit.split("_per_")[1].toUpperCase() : 'Units';
  }, [quickCalcSource, emissionFactors]);

  const modalCalcUnitLabel = useMemo(() => {
    const factor = emissionFactors.find(f => f.id === carbonSource);
    return factor ? factor.unit.split("_per_")[1].toUpperCase() : 'Units';
  }, [carbonSource, emissionFactors]);

  // List filters
  const filteredCarbonTxs = useMemo(() => {
    const q = filterQuery.toLowerCase();
    return carbonTransactions.filter(tx => 
      tx.erp_reference.toLowerCase().includes(q) ||
      tx.source_type.toLowerCase().includes(q)
    );
  }, [carbonTransactions, filterQuery]);

  const filteredGoals = useMemo(() => {
    const q = filterQuery.toLowerCase();
    return environmentalGoals.filter(goal => 
      goal.name.toLowerCase().includes(q)
    );
  }, [environmentalGoals, filterQuery]);

  // Render view
  const navigateTo = (view, subTab = 'all') => {
    setActiveView(view);
    setSubViewTab(subTab);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-logo">e</div>
          <h2 className="brand-name">EcoSphere</h2>
        </div>
        
        <nav className="nav-menu">
          <div className="nav-group-title">Main</div>
          <a className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => navigateTo('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </a>
          
          <div className="nav-group-title">Core Modules</div>
          <a className={`nav-item ${activeView === 'environmental' ? 'active' : ''}`} onClick={() => navigateTo('environmental')}>
            <Leaf size={18} /> Environmental
          </a>
          {activeView === 'environmental' && (
            <div className="sub-nav-group">
              <a className={`sub-nav-item ${subViewTab === 'all' ? 'active' : ''}`} onClick={() => setSubViewTab('all')}>Overview</a>
              <a className={`sub-nav-item ${subViewTab === 'logs' ? 'active' : ''}`} onClick={() => setSubViewTab('logs')}>Carbon Logs</a>
              <a className={`sub-nav-item ${subViewTab === 'goals' ? 'active' : ''}`} onClick={() => setSubViewTab('goals')}>Targets & Goals</a>
            </div>
          )}
          
          <a className={`nav-item ${activeView === 'social' ? 'active' : ''}`} onClick={() => navigateTo('social')}>
            <Users size={18} /> Social & CSR
          </a>
          
          <a className={`nav-item ${activeView === 'governance' ? 'active' : ''}`} onClick={() => navigateTo('governance')}>
            <Shield size={18} /> Governance & Audit
          </a>
          
          <div className="nav-group-title">Gamification</div>
          <a className={`nav-item ${activeView === 'gamification' ? 'active' : ''}`} onClick={() => navigateTo('gamification')}>
            <Trophy size={18} /> Challenges
          </a>
          <a className={`nav-item ${activeView === 'leaderboard' ? 'active' : ''}`} onClick={() => navigateTo('leaderboard')}>
            <BarChart3 size={18} /> Leaderboard
          </a>
          
          <div className="nav-group-title">System</div>
          <a className={`nav-item ${activeView === 'reports' ? 'active' : ''}`} onClick={() => navigateTo('reports')}>
            <FileText size={18} /> Reports
          </a>
          <a className={`nav-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => navigateTo('settings')}>
            <Settings size={18} /> Settings & Config
          </a>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="main-content">
        <header className="header">
          <h1 className="page-title">{activeView.charAt(0).toUpperCase() + activeView.slice(1)} Module</h1>
          <div className="user-profile-widget">
            <div className="badge-xp-indicator">
              <Sparkles size={16} />
              <span>{currentUser.points_balance} Points</span>
            </div>
            
            <div className="user-avatar-info">
              <div className="user-avatar">{currentUser.name.split(" ").map(w => w[0]).join("")}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{currentUser.name}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>ESG Editor</span>
              </div>
            </div>
          </div>
        </header>

        {/* Django Authorization Banner */}
        {backendAuthError && (
          <div style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "#fbbf24", padding: "0.85rem 1.5rem", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyTabContent: "space-between", gap: "1rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><ShieldAlert size={16} /> {backendAuthError}</span>
            <a href={window.location.hostname === 'localhost' ? 'http://localhost:8000/admin/' : 'http://127.0.0.1:8000/admin/'} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ background: "#fbbf24", color: "#000", border: "none", marginLeft: "auto" }}>Login Admin</a>
          </div>
        )}

        <div className="content-body">
          {/* ==================== 1. DASHBOARD VIEW ==================== */}
          {activeView === 'dashboard' && (
            <div className="view-panel">
              <div className="dashboard-grid">
                
                {/* Score Cards */}
                <div className="metrics-row">
                  <div className="glass-card metric-card env">
                    <span className="metric-title">Environmental Score</span>
                    <div className="metric-value-container">
                      <span className="metric-value env">{scores.envScore}</span>
                      <span className="metric-max">/100</span>
                    </div>
                    <span className="metric-trend trend-up"><TrendingUp size={14} /> Targets monitored</span>
                  </div>

                  <div className="glass-card metric-card soc">
                    <span className="metric-title">Social Score</span>
                    <div className="metric-value-container">
                      <span className="metric-value soc">{scores.socialScore}</span>
                      <span className="metric-max">/100</span>
                    </div>
                    <span className="metric-trend trend-up"><TrendingUp size={14} /> CSR engagement active</span>
                  </div>

                  <div className="glass-card metric-card gov">
                    <span className="metric-title">Governance Score</span>
                    <div className="metric-value-container">
                      <span className="metric-value gov">{scores.govScore}</span>
                      <span className="metric-max">/100</span>
                    </div>
                    <span className="metric-trend" style={{ color: scores.overdueCount > 0 ? "var(--color-danger)" : "var(--color-success)" }}>
                      {scores.overdueCount > 0 ? `${scores.overdueCount} issues overdue` : "Registry compliant"}
                    </span>
                  </div>

                  <div className="glass-card metric-card overall">
                    <span className="metric-title">Overall ESG Score</span>
                    <div className="metric-value-container">
                      <span className="metric-value overall">{scores.overallScore}</span>
                      <span className="metric-max">/100</span>
                    </div>
                    <span className="metric-trend" style={{ color: "#fbbf24" }}><Shield size={14} /> Weighted index</span>
                  </div>
                </div>

                {/* Graphs */}
                <div className="charts-row">
                  <div className="glass-card chart-card">
                    <h3 className="chart-title">Emissions Trend (kg CO₂e)</h3>
                    <div className="chart-container">
                      <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                  </div>
                  
                  <div className="glass-card chart-card">
                    <h3 className="chart-title">Department Scores Comparison</h3>
                    <div className="chart-container">
                      <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                  </div>
                </div>

                {/* Grid Details */}
                <div className="dashboard-details-grid">
                  <div className="glass-card">
                    <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Backend Logs & Notifications</h3>
                    <div className="activity-list">
                      {backendNotifications.length > 0 ? (
                        backendNotifications.map(n => (
                          <div className="activity-item" key={n.id}>
                            <div className="activity-icon gov"><Shield size={16} /></div>
                            <div className="activity-details">
                              <p className="activity-desc">{n.message}</p>
                              <span className="activity-time">{n.kind.toUpperCase()}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        activities.map(act => (
                          <div className="activity-item" key={act.id}>
                            <div className={`activity-icon ${act.type}`}><Leaf size={16} /></div>
                            <div className="activity-details">
                              <p className="activity-desc">{act.text}</p>
                              <span className="activity-time">{act.time}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <h3 className="chart-title">Quick Actions</h3>
                    <div className="quick-actions-list">
                      <button className="btn btn-primary" onClick={() => setActiveModal('carbon')}><PlusCircle size={16} /> Log Carbon Data</button>
                      <button className="btn btn-social" onClick={() => navigateTo('social')}><Zap size={16} /> Join CSR Event</button>
                      <button className="btn btn-gov" onClick={() => setActiveModal('compliance')}><AlertTriangle size={16} /> Log Audit Violation</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==================== 2. ENVIRONMENTAL VIEW ==================== */}
          {activeView === 'environmental' && (
            <div className="view-panel">
              <div className="action-controls">
                <div className="search-input-container">
                  <input type="text" placeholder="Search..." className="search-input" value={filterQuery} onChange={e => setFilterQuery(e.target.value)} />
                </div>
                <div className="tabs-row">
                  <button className={`tab-btn ${subViewTab === 'all' ? 'active' : ''}`} onClick={() => setSubViewTab('all')}>All</button>
                  <button className={`tab-btn ${subViewTab === 'logs' ? 'active' : ''}`} onClick={() => setSubViewTab('logs')}>Emissions Logs</button>
                  <button className={`tab-btn ${subViewTab === 'goals' ? 'active' : ''}`} onClick={() => setSubViewTab('goals')}>Targets</button>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveModal('goal')}>New Target</button>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveModal('carbon')}>Log Emissions</button>
                </div>
              </div>

              <div className="environmental-layout" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  
                  {/* Targets */}
                  {(subViewTab === 'all' || subViewTab === 'goals') && (
                    <div className="glass-card">
                      <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Sustainability Targets</h3>
                      <div className="table-container">
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>Goal</th>
                              <th>Department</th>
                              <th>Cap Limit</th>
                              <th>Current</th>
                              <th>Progress</th>
                              <th>Deadline</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredGoals.map(g => {
                              const pct = Math.min(100, Math.round((g.current_value / g.target_value) * 100));
                              return (
                                <tr key={g.id}>
                                  <td style={{ fontWeight: 500, color: "#fff" }}>{g.name}</td>
                                  <td>{departments.find(d => d.id === g.department_id)?.name || "Corporate"}</td>
                                  <td>{g.target_value.toLocaleString()} kg</td>
                                  <td>{g.current_value.toLocaleString()} kg</td>
                                  <td>
                                    <div className="progress-container">
                                      <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${pct}%` }} /></div>
                                      <span>{pct}%</span>
                                    </div>
                                  </td>
                                  <td>{g.deadline}</td>
                                  <td><span className={`status-pill ${g.status === 'missed' ? 'rejected' : 'active'}`}>{g.status.toUpperCase()}</span></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Logs */}
                  {(subViewTab === 'all' || subViewTab === 'logs') && (
                    <div className="glass-card">
                      <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Carbon Operations History</h3>
                      <div className="table-container">
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>ERP Ref</th>
                              <th>Source</th>
                              <th>Quantity</th>
                              <th>Emissions</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCarbonTxs.map(tx => (
                              <tr key={tx.id}>
                                <td style={{ fontFamily: "monospace", color: "#fff" }}>{tx.erp_reference}</td>
                                <td><span className="status-pill medium">{tx.source_type.toUpperCase()}</span></td>
                                <td>{tx.activity_amount}</td>
                                <td style={{ fontWeight: 600, color: "var(--color-env)" }}>{tx.calculated_emissions.toLocaleString()} kg</td>
                                <td>{new Date(tx.transaction_date).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Calculator */}
                <div className="glass-card">
                  <h3 className="chart-title"><Calculator size={18} style={{ marginRight: "0.5rem" }} /> Carbon Projections</h3>
                  <form onSubmit={recordQuickCalc} style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="form-group">
                      <label>Fuel Source</label>
                      <select className="form-control" value={quickCalcSource} onChange={e => setQuickCalcSource(e.target.value)}>
                        {emissionFactors.map(ef => (
                          <option value={ef.id} key={ef.id}>{ef.activity_source.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Amount ({activeCalcUnitLabel})</label>
                      <input type="number" className="form-control" placeholder="100" required value={quickCalcAmount} onChange={e => setQuickCalcAmount(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Record ERP Log</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 3. SOCIAL VIEW ==================== */}
          {activeView === 'social' && (
            <div className="view-panel">
              <div className="action-controls">
                <h3 className="chart-title">CSR Activity catalog</h3>
                <button className="btn btn-social btn-sm" onClick={() => setActiveModal('csr')}>New Event</button>
              </div>

              <div className="card-grid" style={{ marginBottom: "2rem" }}>
                {csrActivities.map(csr => {
                  const joined = participations.some(p => p.activity_id === csr.id);
                  return (
                    <div className="glass-card grid-item-card" key={csr.id}>
                      <div className="card-banner">🌱</div>
                      <h4 className="card-title">{csr.title}</h4>
                      <p className="card-body">{csr.description}</p>
                      <div className="card-meta">
                        <span>XP: +{csr.points_awarded}</span>
                        <span>Max: {csr.max_participants}</span>
                      </div>
                      <button className="btn btn-social" disabled={joined} onClick={() => joinCsr(csr.id)} style={{ width: "100%" }}>
                        {joined ? "Signed Up" : "Join CSR Event"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Participations table */}
              <div className="glass-card">
                <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Activity Approval Desk</h3>
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>CSR Event</th>
                        <th>XP Reward</th>
                        <th>Proof Document</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participations.map(p => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 500, color: "#fff" }}>{p.employee_name}</td>
                          <td>{p.activity_title}</td>
                          <td>+{p.points_earned} XP</td>
                          <td>{p.proof_url ? <a href={p.proof_url} target="_blank" rel="noreferrer" style={{ color: "var(--color-soc)" }}>View Document</a> : "None"}</td>
                          <td><span className={`status-pill ${p.approval_status}`}>{p.approval_status.toUpperCase()}</span></td>
                          <td>
                            {p.approval_status === 'pending' ? (
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button className="btn btn-primary btn-sm" onClick={() => moderateParticipation(p.id, 'approved')}>Approve</button>
                                <button className="btn btn-danger btn-sm" onClick={() => moderateParticipation(p.id, 'rejected')}>Reject</button>
                              </div>
                            ) : (
                              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Closed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 4. GOVERNANCE VIEW (Connected to Django Backend) ==================== */}
          {activeView === 'governance' && (
            <div className="view-panel">
              <div className="action-controls">
                <div className="tabs-row">
                  <button className={`tab-btn ${subViewTab === 'all' || subViewTab === 'policies' ? 'active' : ''}`} onClick={() => setSubViewTab('policies')}>Policies & Handbooks</button>
                  <button className={`tab-btn ${subViewTab === 'compliance' ? 'active' : ''}`} onClick={() => setSubViewTab('compliance')}>Compliance Violations Registry</button>
                </div>
                <button className="btn btn-gov btn-sm" onClick={() => setActiveModal('compliance')}>Report Violation</button>
              </div>

              {/* Policies */}
              {(subViewTab === 'all' || subViewTab === 'policies') && (
                <div className="glass-card" style={{ marginBottom: "2rem" }}>
                  <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Compliance Standards Acknowledgement</h3>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Standard Title</th>
                          <th>Version</th>
                          <th>Effective Date</th>
                          <th>Status</th>
                          <th>Acknowledgement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(backendDashboard ? backendPolicies : [
                          { id: 1, title: "Environmental Waste Standard", version: "1.0", effective_date: "2026-01-01", status: "active", acknowledged: true },
                          { id: 2, title: "Anti-Bribery Policy Guide", version: "2.0", effective_date: "2026-03-01", status: "active", acknowledged: false }
                        ]).map(pol => (
                          <tr key={pol.id}>
                            <td style={{ fontWeight: 500, color: "#fff" }}>{pol.title}</td>
                            <td>v{pol.version}</td>
                            <td>{pol.effective_date}</td>
                            <td><span className="status-pill active">{pol.status.toUpperCase()}</span></td>
                            <td>
                              <button className="btn btn-gov btn-sm" disabled={pol.acknowledged} onClick={() => handleAcknowledgePolicy(pol.id)}>
                                {pol.acknowledged ? "Acknowledged" : "Click to Acknowledge"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Violations */}
              {subViewTab === 'compliance' && (
                <div className="glass-card">
                  <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Active Violations Logs</h3>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Severity</th>
                          <th>Department</th>
                          <th>Owner</th>
                          <th>Due Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(backendDashboard ? backendIssues : [
                          { id: 1, description: "Unsecured chemical storage at Logistics Depot", severity: "high", department: "Logistics", owner: "John Smith", due_date: "2026-07-20", status: "open" }
                        ]).map(issue => (
                          <tr key={issue.id}>
                            <td style={{ fontWeight: 500, color: "#fff" }}>{issue.description}</td>
                            <td><span className={`status-pill ${issue.severity}`}>{issue.severity.toUpperCase()}</span></td>
                            <td>{issue.department}</td>
                            <td>{issue.owner}</td>
                            <td>{issue.due_date}</td>
                            <td><span className={`status-pill ${issue.status}`}>{issue.status.toUpperCase()}</span></td>
                            <td>
                              {issue.status !== "resolved" ? (
                                <button className="btn btn-primary btn-sm" onClick={() => handleResolveIssue(issue.id)}>Resolve Issue</button>
                              ) : (
                                <span style={{ color: "var(--color-env)", fontSize: "0.85rem" }}>Closed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==================== 5. GAMIFICATION VIEW ==================== */}
          {activeView === 'gamification' && (
            <div className="view-panel">
              <div className="card-grid">
                {challenges.map(c => (
                  <div className="glass-card grid-item-card challenge" key={c.id}>
                    <div className="card-banner">🏆</div>
                    <h4 className="card-title">{c.title}</h4>
                    <p className="card-body">{c.description}</p>
                    <div className="card-meta">
                      <span className="status-pill active">+{c.xp_reward} XP</span>
                      <span>Difficulty: {c.difficulty.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 6. LEADERBOARD VIEW ==================== */}
          {activeView === 'leaderboard' && (
            <div className="view-panel">
              <div className="leaderboard-container">
                <div className="glass-card podium-card">
                  <h3 className="chart-title">Podium Standing</h3>
                  <div className="podium-container" style={{ marginTop: "2rem" }}>
                    <div className="podium-step second" style={{ width: "70px" }}>
                      <div className="podium-avatar">JS</div>
                      <span className="podium-rank">2</span>
                      <span className="podium-name">John Smith</span>
                      <span className="podium-xp">320 XP</span>
                    </div>
                    <div className="podium-step first" style={{ width: "70px" }}>
                      <div className="podium-avatar" style={{ borderColor: "#f59e0b" }}>AV</div>
                      <span className="podium-rank">1</span>
                      <span className="podium-name">Aman Verma</span>
                      <span className="podium-xp">1250 XP</span>
                    </div>
                    <div className="podium-step third" style={{ width: "70px" }}>
                      <div className="podium-avatar">JD</div>
                      <span className="podium-rank">3</span>
                      <span className="podium-name">Jane Doe</span>
                      <span className="podium-xp">450 XP</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card">
                  <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Ranks Table</h3>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Employee</th>
                          <th>XP Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((emp, idx) => (
                          <tr key={emp.id}>
                            <td style={{ fontWeight: "bold" }}>#{idx + 1}</td>
                            <td style={{ fontWeight: 500, color: "#fff" }}>{emp.name}</td>
                            <td style={{ color: "#f59e0b", fontWeight: 600 }}>{emp.xp} XP</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 7. REPORTS VIEW ==================== */}
          {activeView === 'reports' && (
            <div className="view-panel">
              
              {/* Department rankings */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr", gap: "1.5rem", marginBottom: "2rem" }}>
                <div className="glass-card" style={{ textAlign: "center" }}>
                  <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Leaderboard steps</h3>
                  <div className="podium-container" style={{ height: "180px" }}>
                    {departmentScores.slice(0, 3).map((dept, index) => {
                      const posClass = index === 0 ? 'first' : index === 1 ? 'second' : 'third';
                      return (
                        <div className={`podium-step ${posClass}`} key={dept.id} style={{ width: "60px" }}>
                          <div className="podium-avatar" style={{ width: "32px", height: "32px", fontSize: "0.8rem", top: "-40px", borderColor: index === 0 ? '#f59e0b' : 'inherit' }}>{dept.name[0]}</div>
                          <span className="podium-rank" style={{ fontSize: "1.15rem", marginTop: "0.5rem" }}>{index + 1}</span>
                          <span className="podium-name" style={{ fontSize: "0.7rem" }}>{dept.name}</span>
                          <span className="podium-xp" style={{ fontSize: "0.75rem", paddingBottom: "0.5rem" }}>{dept.total}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-card">
                  <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Performance Indexes Card</h3>
                  <div className="table-container">
                    <table className="custom-table" style={{ fontSize: "0.85rem" }}>
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Environmental</th>
                          <th>Social</th>
                          <th>Governance</th>
                          <th>Overall</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departmentScores.map(d => (
                          <tr key={d.id}>
                            <td style={{ fontWeight: 500, color: "#fff" }}>{d.name}</td>
                            <td>{d.env}%</td>
                            <td>{d.soc}%</td>
                            <td>{d.gov}%</td>
                            <td style={{ fontWeight: "bold", color: "var(--color-env)" }}>{d.total}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Custom Builder */}
              <div className="report-builder-layout">
                <div className="glass-card">
                  <h3 className="chart-title">Custom Report Builder</h3>
                  <form onSubmit={runCustomReport} style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="form-group">
                      <label>Export Format</label>
                      <select className="form-control" value={reportFormat} onChange={e => setReportFormat(e.target.value)}>
                        <option value="pdf">Adobe Acrobat PDF (.pdf)</option>
                        <option value="csv">Comma-separated values (.csv)</option>
                      </select>
                    </div>
                    <button className="btn btn-primary">Compile Report</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 8. SETTINGS VIEW ==================== */}
          {activeView === 'settings' && (
            <div className="view-panel">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                
                {/* Weights Form */}
                <div className="glass-card">
                  <h3 className="chart-title">Calculation weight configurations</h3>
                  <form onSubmit={saveWeights} style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                      <div className="form-group">
                        <label>Env (%)</label>
                        <input type="number" className="form-control" value={weightEnv} onChange={e => setWeightEnv(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Soc (%)</label>
                        <input type="number" className="form-control" value={weightSoc} onChange={e => setWeightSoc(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Gov (%)</label>
                        <input type="number" className="form-control" value={weightGov} onChange={e => setWeightGov(e.target.value)} />
                      </div>
                    </div>
                    <button className="btn btn-gov" style={{ width: "100%" }}>Save ESG Formula Settings</button>
                  </form>
                </div>

                <div className="glass-card">
                  <h3 className="chart-title">System Switches</h3>
                  <div className="settings-list" style={{ marginTop: "1rem" }}>
                    <div className="settings-toggle-item">
                      <span className="settings-title">Automatic Calculations</span>
                      <label className="switch">
                        <input type="checkbox" checked={settings.auto_emission_calculation} onChange={e => setSettings(prev => ({ ...prev, auto_emission_calculation: e.target.checked }))} />
                        <span className="slider" />
                      </label>
                    </div>
                    <div className="settings-toggle-item">
                      <span className="settings-title">Evidence Proof Requirement</span>
                      <label className="switch">
                        <input type="checkbox" checked={settings.evidence_requirement} onChange={e => setSettings(prev => ({ ...prev, evidence_requirement: e.target.checked }))} />
                        <span className="slider" />
                      </label>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* ==================== MODALS ==================== */}

      {/* Log Carbon Modal */}
      <div className={`modal-overlay ${activeModal === 'carbon' ? 'active' : ''}`}>
        <div className="modal-box">
          <div className="modal-header">
            <h3 className="modal-title">Log Emissions Operation</h3>
            <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
          </div>
          <form onSubmit={logCarbonData}>
            <div className="form-group">
              <label>ERP Invoice ID Reference</label>
              <input type="text" className="form-control" required placeholder="PO-12345" value={carbonRef} onChange={e => setCarbonRef(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Fuel Source</label>
              <select className="form-control" value={carbonSource} onChange={e => setCarbonSource(e.target.value)}>
                {emissionFactors.map(ef => (
                  <option value={ef.id} key={ef.id}>{ef.activity_source.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity ({modalCalcUnitLabel})</label>
              <input type="number" className="form-control" required placeholder="500" value={carbonAmount} onChange={e => setCarbonAmount(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Log Emissions</button>
            </div>
          </form>
        </div>
      </div>

      {/* New Goal Modal */}
      <div className={`modal-overlay ${activeModal === 'goal' ? 'active' : ''}`}>
        <div className="modal-box">
          <div className="modal-header">
            <h3 className="modal-title">Create target</h3>
            <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
          </div>
          <form onSubmit={createGoal}>
            <div className="form-group">
              <label>Goal Objective</label>
              <input type="text" className="form-control" required placeholder="Q3 Fleet Reduction" value={goalName} onChange={e => setGoalName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Limit target cap (kg CO₂e)</label>
              <input type="number" className="form-control" required placeholder="15000" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Goal</button>
            </div>
          </form>
        </div>
      </div>

      {/* Log Compliance Issue Modal */}
      <div className={`modal-overlay ${activeModal === 'compliance' ? 'active' : ''}`}>
        <div className="modal-box">
          <div className="modal-header">
            <h3 className="modal-title">Log Compliance Registry Violation</h3>
            <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
          </div>
          <form onSubmit={handleAddComplianceIssue}>
            <div className="form-group">
              <label>Description of Violation</label>
              <input type="text" className="form-control" required placeholder="Safety hazard noted at Logistics Depot" value={compDesc} onChange={e => setCompDesc(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Severity</label>
              <select className="form-control" value={compSeverity} onChange={e => setCompSeverity(e.target.value)}>
                <option value="low">Low Severity</option>
                <option value="medium">Medium Severity</option>
                <option value="high">High Severity</option>
                <option value="critical">Critical Severity</option>
              </select>
            </div>
            {backendDashboard && (
              <div className="form-group">
                <label>Responsible Department</label>
                <select className="form-control" value={compDeptId} onChange={e => setCompDeptId(e.target.value)}>
                  {backendDashboard.departments.map(d => (
                    <option value={d.id} key={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" className="form-control" required value={compDueDate} onChange={e => setCompDueDate(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Record Violation</button>
            </div>
          </form>
        </div>
      </div>

      {/* CSR Proof Upload Modal */}
      <div className={`modal-overlay ${activeModal === 'proof' ? 'active' : ''}`}>
        <div className="modal-box">
          <div className="modal-header">
            <h3 className="modal-title">Submit Participation Evidence</h3>
            <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
          </div>
          <form onSubmit={submitProof}>
            <div className="form-group">
              <label>Document URL / File Path</label>
              <input type="text" className="form-control" required placeholder="https://storage.local/sapling_drive_proof.jpg" value={proofUrl} onChange={e => setProofUrl(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit Proof</button>
            </div>
          </form>
        </div>
      </div>

      {/* Toasts list */}
      <div className="toast-container">
        {toastQueue.map(t => (
          <div className={`toast ${t.type}`} key={t.id}>
            <div>{t.message}</div>
          </div>
        ))}
      </div>

    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
