import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronDown,
  ShieldAlert,
  ArrowRight
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

export default function App() {
  // ==================== INITIAL STATES ====================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [subViewTab, setSubViewTab] = useState('all'); // 'all', 'goals', 'logs', 'factors', 'policies', 'compliance', 'audits', 'challenges', 'badges', 'rewards'
  const [filterQuery, setFilterQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'carbon', 'goal', 'compliance', 'dept', 'csr', 'proof'
  const [toastQueue, setToastQueue] = useState([]);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('jane.doe@company.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Database State
  const [currentUser, setCurrentUser] = useState({
    id: "jane-doe-uuid",
    name: "Jane Doe",
    email: "jane.doe@company.com",
    role: "employee", // 'employee', 'manager', 'auditor', 'admin'
    department_id: "logistics-uuid",
    xp: 450,
    points_balance: 450,
    badges: ["Green Champion"]
  });

  const [departments, setDepartments] = useState([
    { id: "logistics-uuid", name: "Logistics", code: "LOG-01", employee_count: 45, status: "active" },
    { id: "mfg-uuid", name: "Manufacturing", code: "MFG-02", employee_count: 80, status: "active" },
    { id: "corporate-uuid", name: "Corporate", code: "CORP-03", employee_count: 15, status: "active" }
  ]);

  const [emissionFactors, setEmissionFactors] = useState([
    { id: "elec-factor", activity_source: "electricity", factor: 0.42, unit: "kg_co2_per_kwh", status: "active" },
    { id: "gas-factor", activity_source: "gasoline", factor: 2.31, unit: "kg_co2_per_liter", status: "active" },
    { id: "steel-factor", activity_source: "steel_manufacturing", factor: 1.85, unit: "kg_co2_per_kg", status: "active" },
    { id: "flight-factor", activity_source: "fleet", factor: 0.12, unit: "kg_co2_per_km", status: "active" }
  ]);

  const [productProfiles, setProductProfiles] = useState([
    { id: "prod-1", product_name: "Eco-Packaging Box", product_code: "PKG-ECO", carbon_footprint: 0.05, resource_efficiency_score: 95 },
    { id: "prod-2", product_name: "Standard Carton Box", product_code: "PKG-STD", carbon_footprint: 0.15, resource_efficiency_score: 70 }
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

  const [challenges, setChallenges] = useState([
    { id: "chal-1", title: "Sustainability Sprint", description: "Submit 5 days of zero-single-use-plastic lunches.", category_id: "cat-chal", xp_reward: 200, difficulty: "hard", evidence_required: true, deadline: "2026-07-30T17:00:00Z", status: "active" },
    { id: "chal-2", title: "Decarbonize Challenge", description: "Switch to electric or cycle commute for a continuous week.", category_id: "cat-chal", xp_reward: 150, difficulty: "medium", evidence_required: true, deadline: "2026-08-15T17:00:00Z", status: "active" },
    { id: "chal-3", title: "Commute Green Week", description: "Carpool with 2+ members to reduce fleet carbon.", category_id: "cat-chal", xp_reward: 100, difficulty: "easy", evidence_required: false, deadline: "2026-07-18T17:00:00Z", status: "active" }
  ]);

  const [badges, setBadges] = useState([
    { id: "badge-1", name: "Green Champion", description: "Accumulated more than 300 XP in CSR tasks.", icon: "leaf" },
    { id: "badge-2", name: "Carbon Cutter", description: "Recorded total emissions 20% below target levels.", icon: "scissors" },
    { id: "badge-3", name: "Compliance Guard", description: "Successfully resolved overdue issues.", icon: "shield-check" }
  ]);

  const [rewards, setRewards] = useState([
    { id: "rew-1", name: "Eco-friendly Water Bottle", description: "Vacuum-insulated double-wall stainless steel flask.", points_required: 500, stock: 12, status: "active" },
    { id: "rew-2", name: "Solar Phone Charger", description: "Compact outdoor solar cell panel bank.", points_required: 1200, stock: 5, status: "active" },
    { id: "rew-3", name: "Sustainable Tote Bag", description: "Recycled organic cotton heavy-duty canvas bag.", points_required: 200, stock: 20, status: "active" }
  ]);

  const [policies, setPolicies] = useState([
    { id: "pol-1", title: "Environmental Impact Policy", version: "1.2", effective_date: "2026-01-01", required_role: "all", acknowledged: ["jane-doe-uuid", "john-smith-id"] },
    { id: "pol-2", title: "Anti-Bribery & Corruption Policy", version: "2.0", effective_date: "2026-03-01", required_role: "all", acknowledged: ["jane-doe-uuid"] }
  ]);

  const [audits, setAudits] = useState([
    { id: "aud-1", name: "Q2 Waste Audit", date: "2026-06-10", Scope: "Depot 3 Logistics", auditor: "KPMG Assurance", findings: "Hazardous waste storage alignment warnings.", status: "completed" },
    { id: "aud-2", name: "Q2 Supplier Review", date: "2026-06-25", Scope: "Supply Chain", auditor: "Internal ESG Review", findings: "Two minor vendor mismatches logged.", status: "completed" }
  ]);

  const [complianceIssues, setComplianceIssues] = useState([
    { id: "comp-1", audit_id: "aud-1", severity: "high", description: "Unsecured hazardous waste containers stored behind depot 3.", owner_name: "John Smith", due_date: "2026-07-10", status: "overdue" },
    { id: "comp-2", audit_id: "aud-2", severity: "medium", description: "Vendor compliance mismatch - Supplier 3 certificate expired.", owner_name: "Jane Doe", due_date: "2026-08-01", status: "open" }
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
    { id: 1, text: "Carbon Transaction ERP-103 created by Jane Doe", type: "env", time: "2 hours ago" },
    { id: 2, text: "Jane Doe completed Policy Acknowledgement for Anti-Bribery Policy", type: "gov", time: "5 hours ago" },
    { id: 3, text: "Participation proof uploaded for Tree Plantation Drive", type: "soc", time: "1 day ago" }
  ]);

  const [employees, setEmployees] = useState([
    { id: "jane-doe-uuid", name: "Jane Doe", xp: 450, department: "Logistics" },
    { id: "john-smith-id", name: "John Smith", xp: 320, department: "Logistics" },
    { id: "aman-verma-id", name: "Aman Verma", xp: 1250, department: "Manufacturing" }
  ]);

  // Form Input States
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
  const [compOwner, setCompOwner] = useState('jane-doe-uuid');
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

  // ==================== TOAST DISPATCHER ====================
  const triggerToast = (message, type = "env") => {
    const id = Date.now();
    setToastQueue(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToastQueue(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // ==================== METRICS CALCULATION (useMemo) ====================
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
    const totalAcknowledgeTargets = totalEmployees * policies.length;
    const currentAcknowledgesCount = policies.reduce((acc, curr) => acc + curr.acknowledged.length, 0);
    
    let socialScore = 50;
    if (totalEmployees > 0 && totalAcknowledgeTargets > 0) {
      const partRatio = approvedParticipationsCount / totalEmployees;
      const ackRatio = currentAcknowledgesCount / totalAcknowledgeTargets;
      socialScore = Math.min(100, Math.round((0.6 * partRatio + 0.4 * ackRatio) * 100));
    }
    
    // 3. Governance
    let govScore = 100;
    const openCount = complianceIssues.filter(c => c.status === "open").length;
    const overdueCount = complianceIssues.filter(c => c.status === "overdue").length;
    govScore = Math.max(0, 100 - (openCount * 10) - (overdueCount * 25));
    
    // 4. Overall
    const wEnv = settings.weight_environmental;
    const wSoc = settings.weight_social;
    const wGov = settings.weight_governance;
    const overallScore = Math.round((wEnv * envScore) + (wSoc * socialScore) + (wGov * govScore));
    
    return { envScore, socialScore, govScore, overallScore, openCount, overdueCount };
  }, [carbonTransactions, environmentalGoals, participations, departments, policies, complianceIssues, settings]);

  // Compute departmental Leaderboard for Reports View
  const departmentScores = useMemo(() => {
    const computed = departments.map(dept => {
      const txList = carbonTransactions.filter(t => t.department_id === dept.id);
      const totalEmissions = txList.reduce((acc, curr) => acc + curr.calculated_emissions, 0);
      const matchingGoal = environmentalGoals.find(g => g.department_id === dept.id);
      const target = matchingGoal ? matchingGoal.target_value : 50000;
      const env = Math.max(0, Math.min(100, Math.round(100 * (1 - (totalEmissions / target)))));
      
      const soc = dept.code === 'LOG-01' ? 70 : (dept.code === 'MFG-02' ? 60 : 85);
      const gov = dept.code === 'LOG-01' ? 90 : (dept.code === 'MFG-02' ? 80 : 95);
      
      const total = Math.round((settings.weight_environmental * env) + (settings.weight_social * soc) + (settings.weight_governance * gov));
      
      return {
        id: dept.id,
        name: dept.name,
        env,
        soc,
        gov,
        total
      };
    });
    
    return [...computed].sort((a, b) => b.total - a.total);
  }, [departments, carbonTransactions, environmentalGoals, settings]);

  // Dynamic Chart Values
  const lineChartData = useMemo(() => {
    // Group carbon transaction sums dynamically
    const sums = { "May": 28400, "June": 41385, "July": 5040 };
    // Adjust July dynamically based on current transaction states
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
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === "admin@company.com") {
      setCurrentUser(prev => ({ ...prev, role: "admin", name: "System Admin" }));
    } else {
      setCurrentUser(prev => ({ ...prev, role: "employee", name: "Jane Doe" }));
    }
    setIsAuthenticated(true);
    triggerToast("Logged in successfully!", "gov");
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

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
    
    // Update Goals
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

    setCurrentUser(prev => ({
      ...prev,
      xp: prev.xp + 10,
      points_balance: prev.points_balance + 10
    }));

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

    setCurrentUser(prev => ({
      ...prev,
      xp: prev.xp + 10,
      points_balance: prev.points_balance + 10
    }));

    setQuickCalcAmount('');
    triggerToast(`Logged ${calculatedEmissions} kg CO₂e successfully. +10 XP awarded!`, "env");
  };

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
    triggerToast(`Goal "${goalName}" created successfully.`, "env");
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
    triggerToast(`CSR activity scheduled successfully.`, "soc");
  };

  const logComplianceIssue = (e) => {
    e.preventDefault();
    const ownerName = employees.find(emp => emp.id === compOwner)?.name || "Jane Doe";

    const newIssue = {
      id: `comp-${Date.now()}`,
      audit_id: "Internal Audit",
      severity: compSeverity,
      description: compDesc,
      owner_name: ownerName,
      due_date: compDueDate,
      status: "open"
    };

    setComplianceIssues(prev => [newIssue, ...prev]);
    setActivities(prev => [{
      id: Date.now(),
      text: `Compliance issue reported: "${compDesc}"`,
      type: "gov",
      time: "Just now"
    }, ...prev]);

    setActiveModal(null);
    setCompDesc('');
    triggerToast(`Compliance issue logged. Governance Score impacted.`, "gov");
  };

  const createDept = (e) => {
    e.preventDefault();
    const newDept = {
      id: `dept-${Date.now()}`,
      name: deptName,
      code: deptCode,
      employee_count: parseInt(deptCount),
      status: "active"
    };

    setDepartments(prev => [...prev, newDept]);
    setActiveModal(null);
    setDeptName('');
    setDeptCode('');
    triggerToast(`Department "${deptName}" registered successfully.`, "gov");
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

      setActivities(prev => [{
        id: Date.now(),
        text: `${currentUser.name} joined activity: ${csr.title}`,
        type: "soc",
        time: "Just now"
      }, ...prev]);

      triggerToast(`Joined "${csr.title}". +${csr.points_awarded} Points awarded!`, "soc");
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
    triggerToast(`Evidence uploaded for "${csr.title}". Pending manager approval.`, "soc");
  };

  const moderateParticipation = (partId, decision) => {
    setParticipations(prev => prev.map(p => {
      if (p.id === partId) {
        if (decision === 'approved') {
          // Award XP to employee list
          setEmployees(empList => empList.map(emp => {
            if (emp.name === p.employee_name) {
              return { ...emp, xp: emp.xp + p.points_earned };
            }
            return emp;
          }));

          if (p.employee_name === currentUser.name) {
            setCurrentUser(curr => {
              const updatedXP = curr.xp + p.points_earned;
              const hasChampion = curr.badges.includes("Green Champion");
              const unlockedBadges = [...curr.badges];
              if (settings.badge_auto_award && updatedXP >= 500 && !hasChampion) {
                unlockedBadges.push("Green Champion");
                setTimeout(() => triggerToast("Achievement Unlocked: Green Champion Badge!", "badge"), 100);
              }
              return { ...curr, xp: updatedXP, points_balance: curr.points_balance + p.points_earned, badges: unlockedBadges };
            });
          }
          triggerToast(`Approved participation. Scores updated.`, "soc");
        } else {
          triggerToast(`Rejected participation request.`, "soc");
        }
        return { ...p, approval_status: decision };
      }
      return p;
    }));
  };

  const acknowledgePolicy = (polId) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === polId && !p.acknowledged.includes(currentUser.id)) {
        setActivities(acts => [{
          id: Date.now(),
          text: `${currentUser.name} acknowledged policy: ${p.title}`,
          type: "gov",
          time: "Just now"
        }, ...acts]);

        setCurrentUser(curr => ({
          ...curr,
          xp: curr.xp + 15,
          points_balance: curr.points_balance + 15
        }));

        triggerToast(`Policy acknowledged. +15 XP awarded!`, "gov");
        return { ...p, acknowledged: [...p.acknowledged, currentUser.id] };
      }
      return p;
    }));
  };

  const resolveComplianceIssue = (issueId) => {
    setComplianceIssues(prev => prev.map(c => {
      if (c.id === issueId) {
        setActivities(acts => [{
          id: Date.now(),
          text: `Violation resolved: "${c.description}"`,
          type: "gov",
          time: "Just now"
        }, ...acts]);
        triggerToast(`Violation marked resolved. Governance Score restored.`, "gov");
        return { ...c, status: "resolved" };
      }
      return c;
    }));
  };

  const redeemReward = (rewId) => {
    setRewards(prev => prev.map(r => {
      if (r.id === rewId && r.stock > 0 && currentUser.points_balance >= r.points_required) {
        setCurrentUser(curr => ({ ...curr, points_balance: curr.points_balance - r.points_required }));
        triggerToast(`Redeemed "${r.name}". Points deducted!`, "badge");
        return { ...r, stock: r.stock - 1 };
      }
      return r;
    }));
  };

  const joinChallenge = (title) => {
    triggerToast(`Started Challenge: "${title}". Check details for targets.`, "badge");
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

    setActivities(acts => [{
      id: Date.now(),
      text: `ESG Weights config updated: Env ${weightEnv}%, Soc ${weightSoc}%, Gov ${weightGov}%`,
      type: "gov",
      time: "Just now"
    }, ...acts]);

    triggerToast("Formula weights saved successfully!", "gov");
  };

  const toggleConfigSetting = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
    triggerToast(`Config toggle changed. Scores recalculated.`, "gov");
  };

  const triggerReportGenerate = (name) => {
    triggerToast(`Downloading ${name} report in PDF format.`, "gov");
  };

  const runCustomReport = (e) => {
    e.preventDefault();
    triggerToast(`Compiling and exporting custom report as .${reportFormat}`, "gov");
  };

  // Preview quick calculation
  const quickCalcEmissions = useMemo(() => {
    const factor = emissionFactors.find(f => f.id === quickCalcSource);
    const amt = parseFloat(quickCalcAmount) || 0;
    return factor ? Math.round(amt * factor.factor * 100) / 100 : 0;
  }, [quickCalcSource, quickCalcAmount, emissionFactors]);

  const activeCalcUnitLabel = useMemo(() => {
    const factor = emissionFactors.find(f => f.id === quickCalcSource);
    return factor ? factor.unit.split("_per_")[1].toUpperCase() : 'Units';
  }, [quickCalcSource, emissionFactors]);

  // Preview Modal calculation
  const modalCalcEmissions = useMemo(() => {
    const factor = emissionFactors.find(f => f.id === carbonSource);
    const amt = parseFloat(carbonAmount) || 0;
    return factor ? Math.round(amt * factor.factor * 100) / 100 : 0;
  }, [carbonSource, carbonAmount, emissionFactors]);

  const modalCalcUnitLabel = useMemo(() => {
    const factor = emissionFactors.find(f => f.id === carbonSource);
    return factor ? factor.unit.split("_per_")[1].toUpperCase() : 'Units';
  }, [carbonSource, emissionFactors]);

  // Filter lists based on query
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

  // ==================== VIEW SWITCHING HELPER ====================
  const navigateTo = (view, subTab = 'all') => {
    setActiveView(view);
    setSubViewTab(subTab);
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="brand-logo">e</div>
            <h1 style={{ color: "#fff", fontSize: "1.75rem" }}>EcoSphere</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>ESG Management & ERP Integration</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem", width: "100%" }}>
              Sign In
            </button>
          </form>
          <div style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "1rem" }}>
            Demo Accounts: jane.doe@company.com (Employee), admin@company.com (Admin)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      
      {/* Sidebar Navigation */}
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
              <a className={`sub-nav-item ${subViewTab === 'factors' ? 'active' : ''}`} onClick={() => setSubViewTab('factors')}>Emission Factors</a>
              <a className={`sub-nav-item ${subViewTab === 'logs' ? 'active' : ''}`} onClick={() => setSubViewTab('logs')}>Carbon Logs</a>
              <a className={`sub-nav-item ${subViewTab === 'goals' ? 'active' : ''}`} onClick={() => setSubViewTab('goals')}>Targets & Goals</a>
            </div>
          )}
          
          <a className={`nav-item ${activeView === 'social' ? 'active' : ''}`} onClick={() => navigateTo('social')}>
            <Users size={18} /> Social & Engagement
          </a>
          
          <a className={`nav-item ${activeView === 'governance' ? 'active' : ''}`} onClick={() => navigateTo('governance')}>
            <Shield size={18} /> Governance & Audit
          </a>
          
          <div className="nav-group-title">Gamification</div>
          <a className={`nav-item ${activeView === 'gamification' ? 'active' : ''}`} onClick={() => navigateTo('gamification')}>
            <Trophy size={18} /> Challenges & Rewards
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
        
        <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="status-pill pending" style={{ fontSize: "0.75rem" }}>
            {currentUser.role.toUpperCase()}
          </span>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ padding: "0.25rem 0.5rem;" }}>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="main-content">
        
        {/* Header */}
        <header class="header">
          <h1 class="page-title">{activeView.charAt(0).toUpperCase() + activeView.slice(1)} Module</h1>
          <div class="user-profile-widget">
            <div class="badge-xp-indicator">
              <Sparkles size={16} />
              <span>{currentUser.points_balance} Points</span>
            </div>
            
            <div class="user-avatar-info" onClick={() => navigateTo('gamification', 'badges')}>
              <div class="user-avatar">{currentUser.name.split(" ").map(w => w[0]).join("")}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{currentUser.name}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  {departments.find(d => d.id === currentUser.department_id)?.name}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* View Switcher Viewport */}
        <div className="content-body">
          
          {/* ==================== 1. DASHBOARD VIEW ==================== */}
          {activeView === 'dashboard' && (
            <div className="view-panel">
              <div className="dashboard-grid">
                
                {/* KPI Metrics */}
                <div className="metrics-row">
                  <div className="glass-card metric-card env">
                    <span className="metric-title">Environmental Score</span>
                    <div className="metric-value-container">
                      <span className="metric-value env">{scores.envScore}</span>
                      <span className="metric-max">/100</span>
                    </div>
                    <span className="metric-trend trend-up"><TrendingUp size={14} /> Emissions targets monitored</span>
                  </div>

                  <div className="glass-card metric-card soc">
                    <span className="metric-title">Social Score</span>
                    <div className="metric-value-container">
                      <span className="metric-value soc">{scores.socialScore}</span>
                      <span className="metric-max">/100</span>
                    </div>
                    <span className="metric-trend trend-up"><TrendingUp size={14} /> CSR participations active</span>
                  </div>

                  <div className="glass-card metric-card gov">
                    <span className="metric-title">Governance Score</span>
                    <div className="metric-value-container">
                      <span className="metric-value gov">{scores.govScore}</span>
                      <span className="metric-max">/100</span>
                    </div>
                    {scores.overdueCount > 0 ? (
                      <span className="metric-trend trend-down"><ShieldAlert size={14} /> {scores.overdueCount} penalty overdue issues active</span>
                    ) : scores.openCount > 0 ? (
                      <span className="metric-trend trend-down"><Info size={14} /> {scores.openCount} open issue items reported</span>
                    ) : (
                      <span className="metric-trend trend-up"><Check size={14} /> Compliance registry clear</span>
                    )}
                  </div>

                  <div className="glass-card metric-card overall">
                    <span className="metric-title">Overall ESG Score</span>
                    <div className="metric-value-container">
                      <span className="metric-value overall">{scores.overallScore}</span>
                      <span className="metric-max">/100</span>
                    </div>
                    <span className="metric-trend" style={{ color: "#fbbf24" }}><Shield size={14} /> Weighted performance</span>
                  </div>
                </div>

                {/* Charts */}
                <div className="charts-row">
                  <div className="glass-card chart-card">
                    <div className="chart-header">
                      <h3 className="chart-title">Emission Trend (kg CO₂e)</h3>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Real-time ERP Sync</span>
                    </div>
                    <div className="chart-container">
                      <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                  </div>
                  
                  <div className="glass-card chart-card">
                    <div className="chart-header">
                      <h3 className="chart-title">Department ESG Comparison</h3>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Aggregated Scores</span>
                    </div>
                    <div className="chart-container">
                      <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#f3f4f6' } } } }} />
                    </div>
                  </div>
                </div>

                {/* Details activities / quick actions */}
                <div className="dashboard-details-grid">
                  <div className="glass-card">
                    <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Recent Activity Log</h3>
                    <div className="activity-list">
                      {activities.map(act => (
                        <div className="activity-item" key={act.id}>
                          <div className={`activity-icon ${act.type}`}>
                            {act.type === 'env' && <Leaf size={16} />}
                            {act.type === 'soc' && <Users size={16} />}
                            {act.type === 'gov' && <Shield size={16} />}
                          </div>
                          <div className="activity-details">
                            <p className="activity-desc">{act.text}</p>
                            <span className="activity-time">{act.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <h3 class="chart-title">Quick Actions</h3>
                    <div className="quick-actions-list">
                      <button className="btn btn-primary" onClick={() => setActiveModal('carbon')}>
                        <PlusCircle size={16} /> Log Carbon Data
                      </button>
                      <button className="btn btn-social" onClick={() => navigateTo('gamification', 'challenges')}>
                        <Zap size={16} /> Join New Challenge
                      </button>
                      <button className="btn btn-gov" onClick={() => setActiveModal('compliance')}>
                        <AlertTriangle size={16} /> Report Compliance Issue
                      </button>
                      <button className="btn btn-secondary" onClick={() => navigateTo('reports')}>
                        <FileText size={16} /> Build Custom Report
                      </button>
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
                  <input
                    type="text"
                    placeholder="Search goals..."
                    className="search-input"
                    value={filterQuery}
                    onChange={e => setFilterQuery(e.target.value)}
                  />
                </div>
                <div className="tabs-row">
                  <button className={`tab-btn ${subViewTab === 'all' ? 'active' : ''}`} onClick={() => setSubViewTab('all')}>All</button>
                  <button className={`tab-btn ${subViewTab === 'goals' ? 'active' : ''}`} onClick={() => setSubViewTab('goals')}>Sustainability Goals</button>
                  <button className={`tab-btn ${subViewTab === 'logs' ? 'active' : ''}`} onClick={() => setSubViewTab('logs')}>Carbon Logs</button>
                  <button className={`tab-btn ${subViewTab === 'factors' ? 'active' : ''}`} onClick={() => setSubViewTab('factors')}>Emission Factors</button>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => triggerToast("Exporting to env_export.csv", "env")}>
                    <DownloadCloud size={14} /> Export
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveModal('goal')}>
                    New Goal
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveModal('carbon')}>
                    Log Carbon
                  </button>
                </div>
              </div>

              {/* Layout Split: Tables on Left, Quick Calculator on Right */}
              <div className="environmental-layout" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Environmental Goals */}
                  {(subViewTab === 'all' || subViewTab === 'goals') && (
                    <div className="glass-card">
                      <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Departmental Sustainability Targets</h3>
                      <div className="table-container">
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>Goal Name</th>
                              <th>Department</th>
                              <th>Target Limit</th>
                              <th>Current Value</th>
                              <th>Progress</th>
                              <th>Deadline</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredGoals.map(goal => {
                              const pct = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
                              return (
                                <tr key={goal.id}>
                                  <td style={{ fontWeight: 500, color: "#fff" }}>{goal.name}</td>
                                  <td>{departments.find(d => d.id === goal.department_id)?.name}</td>
                                  <td>{goal.target_value.toLocaleString()} kg</td>
                                  <td>{goal.current_value.toLocaleString()} kg</td>
                                  <td>
                                    <div className="progress-container">
                                      <div className="progress-bar-bg">
                                        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct > 100 ? 'var(--color-danger)' : 'var(--color-env)' }}></div>
                                      </div>
                                      <span style={{ fontSize: "0.8rem" }}>{pct}%</span>
                                    </div>
                                  </td>
                                  <td>{new Date(goal.deadline).toLocaleDateString()}</td>
                                  <td>
                                    <span className={`status-pill ${goal.status === 'achieved' ? 'completed' : goal.status === 'missed' ? 'overdue' : 'active'}`}>
                                      {goal.status.toUpperCase()}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Carbon Logs */}
                  {(subViewTab === 'all' || subViewTab === 'logs') && (
                    <div className="glass-card">
                      <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Carbon Transaction History</h3>
                      <div className="table-container">
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>ERP Reference</th>
                              <th>Source Type</th>
                              <th>Activity Amount</th>
                              <th>Calculated emissions</th>
                              <th>Department</th>
                              <th>Date Logged</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCarbonTxs.map(tx => (
                              <tr key={tx.id}>
                                <td style={{ fontFamily: "monospace", color: "#fff" }}>{tx.erp_reference}</td>
                                <td><span className="status-pill medium">{tx.source_type.toUpperCase()}</span></td>
                                <td>{tx.activity_amount}</td>
                                <td style={{ fontWeight: 600, color: "var(--color-env)" }}>{tx.calculated_emissions.toLocaleString()} kg</td>
                                <td>{departments.find(d => d.id === tx.department_id)?.name}</td>
                                <td>{new Date(tx.transaction_date).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Emission Factors */}
                  {subViewTab === 'factors' && (
                    <div className="glass-card">
                      <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Emission Coefficient Settings</h3>
                      <div className="table-container">
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>Source Activity</th>
                              <th>Factor Coefficient</th>
                              <th>Unit</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {emissionFactors.map(ef => (
                              <tr key={ef.id}>
                                <td style={{ fontWeight: 500, color: "#fff" }}>{ef.activity_source.replace("_", " ").toUpperCase()}</td>
                                <td>{ef.factor}</td>
                                <td>{ef.unit}</td>
                                <td><span className="status-pill active">{ef.status.toUpperCase()}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Quick Calculator Widget */}
                <div className="glass-card" style={{ position: "sticky", top: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <h3 className="chart-title"><Calculator size={18} style={{ color: "var(--color-env)", verticalAlign: "middle", marginRight: "0.5rem" }} /> Quick Carbon Calculator</h3>
                  <form onSubmit={recordQuickCalc}>
                    <div className="form-group">
                      <label>Fuel / Activity Source</label>
                      <select className="form-control" value={quickCalcSource} onChange={e => setQuickCalcSource(e.target.value)}>
                        {emissionFactors.map(ef => (
                          <option value={ef.id} key={ef.id}>{ef.activity_source.replace("_", " ").toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Amount ({activeCalcUnitLabel})</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 100"
                        required
                        value={quickCalcAmount}
                        onChange={e => setQuickCalcAmount(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Department</label>
                      <select className="form-control" value={quickCalcDept} onChange={e => setQuickCalcDept(e.target.value)}>
                        {departments.map(d => (
                          <option value={d.id} key={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="activity-item" style={{ marginBottom: "1rem", padding: "0.75rem", borderColor: "rgba(16, 185, 129, 0.2)", background: "rgba(16, 185, 129, 0.03)" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>Emissions Result Projection</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-env)" }}>{quickCalcEmissions.toLocaleString()} kg CO₂e</div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                        Record ERP Log
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* ==================== 3. SOCIAL VIEW ==================== */}
          {activeView === 'social' && (
            <div className="view-panel">
              <div className="action-controls" style={{ marginBottom: "2rem" }}>
                <h3 className="chart-title">CSR Initiatives</h3>
                <button className="btn btn-social btn-sm" onClick={() => setActiveModal('csr')}>
                  New Activity
                </button>
              </div>

              {/* CSR Events Cards Grid */}
              <div className="card-grid" style={{ marginBottom: "2rem" }}>
                {csrActivities.map(csr => {
                  const joined = participations.some(p => p.employee_name === currentUser.name && p.activity_id === csr.id);
                  const isApproved = participations.some(p => p.employee_name === currentUser.name && p.activity_id === csr.id && p.approval_status === "approved");
                  
                  let btnText = joined ? "Joined (Pending Proof)" : "Join Activity";
                  if (isApproved) btnText = "Joined & Approved";
                  if (csr.status === "completed") btnText = "Activity Completed";
                  
                  return (
                    <div className="glass-card grid-item-card" key={csr.id}>
                      <div className="card-banner">🌍</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <span className="status-pill active" style={{ width: "fit-content", fontSize: "0.7rem" }}>+ {csr.points_awarded} PTS</span>
                        <h4 className="card-title">{csr.title}</h4>
                      </div>
                      <p className="card-body">{csr.description}</p>
                      <div className="card-meta">
                        <span>Date: {new Date(csr.date).toLocaleDateString()}</span>
                        <span>Max: {csr.max_participants} slots</span>
                      </div>
                      <button
                        className={`btn ${csr.status === 'completed' ? 'btn-secondary' : 'btn-social'}`}
                        disabled={joined || csr.status === 'completed'}
                        onClick={() => joinCsr(csr.id)}
                        style={{ width: "100%" }}
                      >
                        {btnText}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Participations Moderation Table */}
              <div className="glass-card">
                <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Employee Participation Approval Desk</h3>
                <div className="table-container">
                  <table class="custom-table">
                    <thead>
                      <tr>
                        <th>Employee Name</th>
                        <th>CSR Activity</th>
                        <th>Date Logged</th>
                        <th>Points</th>
                        <th>Proof Link</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participations.map(part => (
                        <tr key={part.id}>
                          <td style={{ fontWeight: 500, color: "#fff" }}>{part.employee_name}</td>
                          <td>{part.activity_title}</td>
                          <td>{new Date(part.date_logged).toLocaleDateString()}</td>
                          <td>+ {part.points_earned} PTS</td>
                          <td>
                            {part.proof_url ? (
                              <a href={part.proof_url} target="_blank" rel="noreferrer" style={{ color: "var(--color-soc)", textDecoration: "underline" }}>View Proof</a>
                            ) : "No proof attached"}
                          </td>
                          <td><span className={`status-pill ${part.approval_status}`}>{part.approval_status.toUpperCase()}</span></td>
                          <td>
                            {part.approval_status === "pending" ? (
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button className="btn btn-primary btn-sm" onClick={() => moderateParticipation(part.id, 'approved')}>Approve</button>
                                <button className="btn btn-danger btn-sm" onClick={() => moderateParticipation(part.id, 'rejected')}>Reject</button>
                              </div>
                            ) : (
                              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Decided</span>
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

          {/* ==================== 4. GOVERNANCE VIEW ==================== */}
          {activeView === 'governance' && (
            <div className="view-panel">
              <div className="action-controls">
                <div className="tabs-row">
                  <button className={`tab-btn ${subViewTab === 'all' || subViewTab === 'policies' ? 'active' : ''}`} onClick={() => setSubViewTab('policies')}>ESG Policies</button>
                  <button className={`tab-btn ${subViewTab === 'compliance' ? 'active' : ''}`} onClick={() => setSubViewTab('compliance')}>Compliance Registry</button>
                  <button className={`tab-btn ${subViewTab === 'audits' ? 'active' : ''}`} onClick={() => setSubViewTab('audits')}>Auditing Logs</button>
                </div>
                <button className="btn btn-gov btn-sm" onClick={() => setActiveModal('compliance')}>
                  Log Compliance Issue
                </button>
              </div>

              {/* Policies Table */}
              {(subViewTab === 'all' || subViewTab === 'policies') && (
                <div className="glass-card" style={{ marginBottom: "2rem" }}>
                  <h3 className="chart-title" style={{ marginBottom: "1rem" }}>ESG Policy Manual & Acknowledgements</h3>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Policy Title</th>
                          <th>Version</th>
                          <th>Effective Date</th>
                          <th>Required Role</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {policies.map(pol => {
                          const acknowledged = pol.acknowledged.includes(currentUser.id);
                          return (
                            <tr key={pol.id}>
                              <td style={{ fontWeight: 500, color: "#fff" }}>{pol.title}</td>
                              <td>v{pol.version}</td>
                              <td>{new Date(pol.effective_date).toLocaleDateString()}</td>
                              <td>{pol.required_role.toUpperCase()}</td>
                              <td>
                                <span className={`status-pill ${acknowledged ? 'active-state' : 'draft'}`}>
                                  {acknowledged ? 'Acknowledged' : 'Required'}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-gov btn-sm"
                                  disabled={acknowledged}
                                  onClick={() => acknowledgePolicy(pol.id)}
                                >
                                  {acknowledged ? 'Completed' : 'Acknowledge'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Compliance Registry */}
              {subViewTab === 'compliance' && (
                <div className="glass-card" style={{ marginBottom: "2rem" }}>
                  <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Active Violations Registry</h3>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Violation Description</th>
                          <th>Severity</th>
                          <th>Assigned Owner</th>
                          <th>Target Due Date</th>
                          <th>Audit ID</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {complianceIssues.map(issue => (
                          <tr key={issue.id}>
                            <td style={{ fontWeight: 500, color: "#fff" }}>{issue.description}</td>
                            <td><span className={`status-pill ${issue.severity}`}>{issue.severity.toUpperCase()}</span></td>
                            <td>{issue.owner_name}</td>
                            <td>{new Date(issue.due_date).toLocaleDateString()}</td>
                            <td style={{ fontFamily: "monospace" }}>{issue.audit_id}</td>
                            <td><span className={`status-pill ${issue.status}`}>{issue.status.toUpperCase()}</span></td>
                            <td>
                              {issue.status !== "resolved" ? (
                                <button className="btn btn-primary btn-sm" onClick={() => resolveComplianceIssue(issue.id)}>
                                  Mark Resolved
                                </button>
                              ) : (
                                <span style={{ fontSize: "0.8rem", color: "var(--text-success)" }}>Closed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Completed Audits */}
              {subViewTab === 'audits' && (
                <div className="glass-card">
                  <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Completed Governance Audits</h3>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Audit Title</th>
                          <th>Date</th>
                          <th>Auditor</th>
                          <th>Scope</th>
                          <th>Key Findings</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {audits.map(audit => (
                          <tr key={audit.id}>
                            <td style={{ fontWeight: 500, color: "#fff" }}>{audit.name}</td>
                            <td>{new Date(audit.date).toLocaleDateString()}</td>
                            <td>{audit.auditor}</td>
                            <td>{audit.Scope}</td>
                            <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxBoxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{audit.findings}</td>
                            <td><span className="status-pill active">COMPLETED</span></td>
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
              <div className="tabs-row" style={{ marginBottom: "1.5rem", width: "fit-content" }}>
                <button className={`tab-btn ${subViewTab === 'all' || subViewTab === 'challenges' ? 'active' : ''}`} onClick={() => setSubViewTab('challenges')}>Sustainability Challenges</button>
                <button className={`tab-btn ${subViewTab === 'badges' ? 'active' : ''}`} onClick={() => setSubViewTab('badges')}>Unlocked Badges</button>
                <button className={`tab-btn ${subViewTab === 'rewards' ? 'active' : ''}`} onClick={() => setSubViewTab('rewards')}>Redeem Incentives</button>
              </div>

              {/* Challenges */}
              {(subViewTab === 'all' || subViewTab === 'challenges') && (
                <div className="card-grid">
                  {challenges.map(chal => (
                    <div className="glass-card grid-item-card challenge" key={chal.id}>
                      <div className="card-banner">⚡</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <span className="status-pill active" style={{ width: "fit-content", fontSize: "0.7rem", color: "#f59e0b", borderColor: "rgba(245,158,11,0.2)" }}>+ {chal.xp_reward} XP</span>
                        <h4 className="card-title">{chal.title}</h4>
                      </div>
                      <p className="card-body">{chal.description}</p>
                      <div className="card-meta">
                        <span>Difficulty: {chal.difficulty.toUpperCase()}</span>
                        <span>Deadline: {new Date(chal.deadline).toLocaleDateString()}</span>
                      </div>
                      <button className="btn btn-primary" style={{ background: "#f59e0b", color: "#000" }} onClick={() => joinChallenge(chal.title)}>
                        Start Challenge
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Badges */}
              {subViewTab === 'badges' && (
                <div className="card-grid">
                  {badges.map(badge => {
                    const unlocked = currentUser.badges.includes(badge.name);
                    return (
                      <div className="glass-card grid-item-card" key={badge.id} style={{ opacity: unlocked ? 1 : 0.45, filter: unlocked ? 'none' : 'grayscale(1)' }}>
                        <div className="card-banner" style={{ fontSize: "2.25rem", background: "rgba(245, 158, 11, 0.1)" }}>🏆</div>
                        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                          <h4 className="card-title">{badge.name}</h4>
                          <span className={`status-pill ${unlocked ? 'active-state' : 'pending'}`}>
                            {unlocked ? 'UNLOCKED' : 'LOCKED'}
                          </span>
                        </div>
                        <p className="card-body" style={{ textAlign: "center" }}>{badge.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Rewards */}
              {subViewTab === 'rewards' && (
                <div className="card-grid">
                  {rewards.map(rew => {
                    const disabled = rew.stock <= 0 || currentUser.points_balance < rew.points_required;
                    return (
                      <div className="glass-card grid-item-card" key={rew.id}>
                        <div className="card-banner" style={{ background: "rgba(139, 92, 246, 0.1)" }}>🎁</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          <span className="status-pill active" style={{ width: "fit-content", fontSize: "0.7rem", color: "var(--color-gov)", borderColor: "rgba(139,92,246,0.2)" }}>{rew.points_required} PTS REQUIRED</span>
                          <h4 className="card-title">{rew.name}</h4>
                        </div>
                        <p className="card-body">{rew.description}</p>
                        <div className="card-meta">
                          <span>In Stock: {rew.stock} left</span>
                          <span>Status: {rew.status.toUpperCase()}</span>
                        </div>
                        <button className="btn btn-gov" disabled={disabled} onClick={() => redeemReward(rew.id)} style={{ width: "100%" }}>
                          Redeem Incentive
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ==================== 6. LEADERBOARD VIEW ==================== */}
          {activeView === 'leaderboard' && (
            <div className="view-panel">
              <div className="leaderboard-container">
                <div className="glass-card podium-card">
                  <h3 className="chart-title">Leaderboard Podium</h3>
                  <div className="podium-container">
                    {[...employees].sort((a,b) => b.xp - a.xp).slice(0, 3).map((emp, index) => {
                      const posClass = index === 0 ? 'first' : index === 1 ? 'second' : 'third';
                      const initials = emp.name.split(" ").map(w => w[0]).join("");
                      return (
                        <div className={`podium-step ${posClass}`} key={emp.id} style={{ width: "70px" }}>
                          <div className="podium-avatar" style={{ borderColor: index === 0 ? '#f59e0b' : 'inherit' }}>{initials}</div>
                          <span className="podium-rank">{index + 1}</span>
                          <span className="podium-name">{emp.name}</span>
                          <span className="podium-xp">{emp.xp} XP</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-card">
                  <h3 className="chart-title" style={{ marginBottom: "1.5rem" }}>Corporate Leaderboard Ranks</h3>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Employee Name</th>
                          <th>Department</th>
                          <th>XP Points</th>
                          <th>Badges</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...employees].sort((a,b) => b.xp - a.xp).map((emp, idx) => (
                          <tr key={emp.id}>
                            <td style={{ fontWeight: "bold" }}>#{idx + 1}</td>
                            <td style={{ fontWeight: 500, color: "#fff" }}>
                              {emp.name} {emp.id === currentUser.id && <span className="status-pill pending" style={{ fontSize: "0.65rem", marginLeft: "0.5rem" }}>YOU</span>}
                            </td>
                            <td>{emp.department}</td>
                            <td style={{ color: "#f59e0b", fontWeight: 600 }}>{emp.xp} XP</td>
                            <td>🏆 {emp.id === currentUser.id ? currentUser.badges.length : 1} Badges</td>
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
              
              {/* Wireframe 6 - Department Podium & Scorecard */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: "1.5rem", marginBottom: "2rem" }}>
                <div className="glass-card" style={{ display: "flex", flexDirection: "column", alignTabItems: "center", justifyTabContent: "center", textAlign: "center", padding: "1.5rem" }}>
                  <h3 className="chart-title" style={{ marginBottom: "1rem" }}><Award size={18} style={{ color: "#f59e0b", verticalAlign: "middle", marginRight: "0.5rem" }} /> Department Podium</h3>
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

                <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <h3 className="chart-title" style={{ marginBottom: "1rem" }}>Department Score Card</h3>
                  <div className="table-container">
                    <table className="custom-table" style={{ fontSize: "0.85rem" }}>
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Environmental</th>
                          <th>Social</th>
                          <th>Governance</th>
                          <th>Overall ESG</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departmentScores.map(dept => (
                          <tr key={dept.id}>
                            <td style={{ fontWeight: 500, color: "#fff" }}>{dept.name}</td>
                            <td>{dept.env}%</td>
                            <td>{dept.soc}%</td>
                            <td>{dept.gov}%</td>
                            <td style={{ fontWeight: "bold", color: "var(--color-env)" }}>{dept.total}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Custom Builder Grid */}
              <div className="report-builder-layout">
                <div className="glass-card">
                  <h3 className="chart-title" style={{ marginBottom: "1.5rem" }}><Sliders size={18} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} /> Custom Report Builder</h3>
                  <form onSubmit={runCustomReport}>
                    <div className="form-group">
                      <label>Department Filter</label>
                      <select className="form-control" value={reportDeptFilter} onChange={e => setReportDeptFilter(e.target.value)}>
                        <option value="all">All Departments</option>
                        {departments.map(d => (
                          <option value={d.id} key={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" className="form-control" value={reportStartDate} onChange={e => setReportStartDate(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input type="date" className="form-control" value={reportEndDate} onChange={e => setReportEndDate(e.target.value)} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Include Core ESG Modules</label>
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={repEnvCheck} onChange={e => setRepEnvCheck(e.target.checked)} /> Environmental
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={repSocCheck} onChange={e => setRepSocCheck(e.target.checked)} /> Social
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" checked={repGovCheck} onChange={e => setRepGovCheck(e.target.checked)} /> Governance
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Export Document Format</label>
                      <select className="form-control" value={reportFormat} onChange={e => setReportFormat(e.target.value)}>
                        <option value="pdf">Acrobat PDF Format (.pdf)</option>
                        <option value="xls">Microsoft Excel Spreadsheet (.xlsx)</option>
                        <option value="csv">Comma-separated Values (.csv)</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                      Compile & Generate Report
                    </button>
                  </form>
                </div>

                <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <h3 className="chart-title">Platform ESG Summary Reports</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {['Environmental Scope', 'Social Engagement', 'Governance Auditing', 'ESG Comprehensive'].map(name => (
                      <div className="activity-item" style={{ padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }} key={name}>
                        <div>
                          <h4 style={{ fontWeight: 600, color: "#fff", marginBottom: "0.25rem" }}>{name} Summary Report</h4>
                          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Track standard aggregates and index performance trends.</p>
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={() => triggerReportGenerate(name)}>
                          <DownloadCloud size={14} /> Generate
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 8. SETTINGS VIEW ==================== */}
          {activeView === 'settings' && (
            <div className="view-panel">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                
                {/* Scoring Weights */}
                <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <h3 className="chart-title"><Sliders size={18} style={{ color: "var(--color-gov)", verticalAlign: "middle", marginRight: "0.5rem" }} /> ESG Scoring Weights</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Configure the system-wide weights used to calculate the Overall ESG Score.</p>
                  <form onSubmit={saveWeights} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                      <div className="form-group">
                        <label>Environmental (%)</label>
                        <input type="number" className="form-control" value={weightEnv} onChange={e => setWeightEnv(e.target.value)} min="0" max="100" required />
                      </div>
                      <div className="form-group">
                        <label>Social (%)</label>
                        <input type="number" className="form-control" value={weightSoc} onChange={e => setWeightSoc(e.target.value)} min="0" max="100" required />
                      </div>
                      <div className="form-group">
                        <label>Governance (%)</label>
                        <input type="number" className="form-control" value={weightGov} onChange={e => setWeightGov(e.target.value)} min="0" max="100" required />
                      </div>
                    </div>
                    <div className="activity-item" style={{ padding: "0.75rem", borderColor: "rgba(139, 92, 246, 0.2)", background: "rgba(139, 92, 246, 0.03)" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>Formula Model Preview</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--color-gov)" }}>
                        Overall Score = (Env * {(parseFloat(weightEnv)/100).toFixed(2)}) + (Soc * {(parseFloat(weightSoc)/100).toFixed(2)}) + (Gov * {(parseFloat(weightGov)/100).toFixed(2)})
                      </div>
                    </div>
                    <button type="submit" className="btn btn-gov" style={{ width: "100%" }}>
                      Save Formula Weights
                    </button>
                  </form>
                </div>

                {/* System Switches */}
                <div className="glass-card">
                  <h3 className="chart-title" style={{ marginBottom: "1rem" }}>System Switches & Configuration</h3>
                  <div className="settings-list">
                    <div className="settings-toggle-item" style={{ paddingBottom: "1rem", marginBottom: 0, border: "none" }}>
                      <div className="settings-info">
                        <span className="settings-title">Automatic Emission Calculation</span>
                        <span className="settings-desc">Compute carbon transactions from ERP data automatically.</span>
                      </div>
                      <label className="switch">
                        <input type="checkbox" checked={settings.auto_emission_calculation} onChange={e => toggleConfigSetting('auto_emission_calculation', e.target.checked)} />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="settings-toggle-item" style={{ paddingBottom: "1rem", marginBottom: 0, border: "none" }}>
                      <div className="settings-info">
                        <span class="settings-title">Evidence & Proof Requirement</span>
                        <span class="settings-desc">Block approvals of CSR activity participations without proof files.</span>
                      </div>
                      <label className="switch">
                        <input type="checkbox" checked={settings.evidence_requirement} onChange={e => toggleConfigSetting('evidence_requirement', e.target.checked)} />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="settings-toggle-item" style={{ paddingBottom: "1rem", marginBottom: 0, border: "none" }}>
                      <div className="settings-info">
                        <span class="settings-title">Automatic Badge Award Triggers</span>
                        <span class="settings-desc">Instantly unlock employee achievement badges on target completions.</span>
                      </div>
                      <label className="switch">
                        <input type="checkbox" checked={settings.badge_auto_award} onChange={e => toggleConfigSetting('badge_auto_award', e.target.checked)} />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="settings-toggle-item" style={{ paddingBottom: 0, border: "none" }}>
                      <div className="settings-info">
                        <span class="settings-title">Escalate Overdue Violations</span>
                        <span class="settings-desc">Auto-escalate compliance issues that cross target due dates.</span>
                      </div>
                      <label className="switch">
                        <input type="checkbox" checked={settings.escalate_overdue} onChange={e => toggleConfigSetting('escalate_overdue', e.target.checked)} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

              </div>

              {/* Departments Registry & Collaborators */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
                <div className="glass-card">
                  <div className="chart-header" style={{ marginBottom: "1rem" }}>
                    <h3 className="chart-title">Departments Registry</h3>
                    <button className="btn btn-primary btn-sm" onClick={() => setActiveModal('dept')}>Add Dept</button>
                  </div>
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Dept Code</th>
                          <th>Department Name</th>
                          <th>Employee Count</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.map(d => (
                          <tr key={d.id}>
                            <td style={{ fontFamily: "monospace", color: "#fff" }}>{d.code}</td>
                            <td style={{ fontWeight: 500 }}>{d.name}</td>
                            <td>{d.employee_count} employees</td>
                            <td><span className="status-pill active">{d.status.toUpperCase()}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="glass-card">
                  <h3 className="chart-title" style={{ marginBottom: "1rem" }}>ESG Team & Collaborators</h3>
                  <div className="table-container">
                    <table className="custom-table" style={{ fontSize: "0.85rem" }}>
                      <thead>
                        <tr>
                          <th>Collaborator</th>
                          <th>Role</th>
                          <th>Department</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map(emp => {
                          let r = "Editor";
                          if (emp.id === currentUser.id) r = currentUser.role.toUpperCase();
                          else if (emp.name === "Aman Verma") r = "ADMIN";
                          return (
                            <tr key={emp.id}>
                              <td style={{ fontWeight: 500, color: "#fff" }}>{emp.name}</td>
                              <td><span className="status-pill active-state" style={{ fontSize: "0.7rem" }}>{r}</span></td>
                              <td>{emp.department}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ==================== MODALS & DIALOGS OVERLAYS ==================== */}

      {/* Modal: Log Carbon Data */}
      <div className={`modal-overlay ${activeModal === 'carbon' ? 'active' : ''}`}>
        <div className="modal-box">
          <div className="modal-header">
            <h3 className="modal-title">Log Carbon Transaction</h3>
            <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
          </div>
          <form onSubmit={logCarbonData}>
            <div className="form-group">
              <label>ERP Reference Invoice / Order ID</label>
              <input type="text" className="form-control" required placeholder="e.g. PO-87103" value={carbonRef} onChange={e => setCarbonRef(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Activity Category Source</label>
              <select className="form-control" required value={carbonSource} onChange={e => setCarbonSource(e.target.value)}>
                {emissionFactors.map(ef => (
                  <option value={ef.id} key={ef.id}>{ef.activity_source.replace("_", " ").toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Operating Department</label>
              <select className="form-control" required value={carbonDept} onChange={e => setCarbonDept(e.target.value)}>
                {departments.map(d => (
                  <option value={d.id} key={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Activity Quantity ({modalCalcUnitLabel})</label>
              <input type="number" className="form-control" required step="any" placeholder="e.g. 500" value={carbonAmount} onChange={e => setCarbonAmount(e.target.value)} />
            </div>
            <div className="activity-item" style={{ marginBottom: "1.25rem", padding: "0.75rem", borderColor: "rgba(16, 185, 129, 0.2)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Real-time Calculation Preview</div>
              <div style={{ fontSize: "1.15rem", fontWeight: "bold", color: "var(--color-env)" }}>{modalCalcEmissions.toLocaleString()} kg CO₂e</div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Log Transaction</button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal: New Goal */}
      <div className={`modal-overlay ${activeModal === 'goal' ? 'active' : ''}`}>
        <div className="modal-box">
          <div className="modal-header">
            <h3 className="modal-title">Create Sustainability Target</h3>
            <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
          </div>
          <form onSubmit={createGoal}>
            <div className="form-group">
              <label>Target Objective Name</label>
              <input type="text" className="form-control" required placeholder="e.g. Q3 Logistics Carbon Cap" value={goalName} onChange={e => setGoalName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select className="form-control" required value={goalDept} onChange={e => setGoalDept(e.target.value)}>
                {departments.map(d => (
                  <option value={d.id} key={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Emission Cap Limit (kg CO₂e)</label>
              <input type="number" className="form-control" required placeholder="e.g. 15000" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Target Deadline Date</label>
              <input type="date" className="form-control" required value={goalDeadline} onChange={e => setGoalDeadline(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button type="button" class="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" class="btn btn-primary">Establish Goal</button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal: Report Compliance issue */}
      <div className={`modal-overlay ${activeModal === 'compliance' ? 'active' : ''}`}>
        <div className="modal-box">
          <div className="modal-header">
            <h3 className="modal-title">Log Compliance Registry Violation</h3>
            <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
          </div>
          <form onSubmit={logComplianceIssue}>
            <div className="form-group">
              <label>Compliance Violation Description</label>
              <input type="text" className="form-control" required placeholder="e.g. Fuel leak not reported." value={compDesc} onChange={e => setCompDesc(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Issue Severity Level</label>
              <select className="form-control" required value={compSeverity} onChange={e => setCompSeverity(e.target.value)}>
                <option value="low">Low Severity (Alert)</option>
                <option value="medium">Medium Severity (Warning)</option>
                <option value="high">High Severity (Penalty)</option>
                <option value="critical">Critical Severity (Severe)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Assigned Resolving Owner</label>
              <select className="form-control" required value={compOwner} onChange={e => setCompOwner(e.target.value)}>
                {employees.map(emp => (
                  <option value={emp.id} key={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Resolution Due Date</label>
              <input type="date" className="form-control" required value={compDueDate} onChange={e => setCompDueDate(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Record Violation</button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal: Add Department */}
      <div className={`modal-overlay ${activeModal === 'dept' ? 'active' : ''}`}>
        <div className="modal-box">
          <div className="modal-header">
            <h3 className="modal-title">Add New Department</h3>
            <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
          </div>
          <form onSubmit={createDept}>
            <div className="form-group">
              <label>Department Name</label>
              <input type="text" className="form-control" required placeholder="e.g. Human Resources" value={deptName} onChange={e => setDeptName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Department Unique Code</label>
              <input type="text" className="form-control" required placeholder="e.g. HR-01" value={deptCode} onChange={e => setDeptCode(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Employee Headcount Count</label>
              <input type="number" className="form-control" required value={deptCount} onChange={e => setDeptCount(e.target.value)} />
            </div>
            <div class="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Department</button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal: Create CSR Activity */}
      <div className={`modal-overlay ${activeModal === 'csr' ? 'active' : ''}`}>
        <div className="modal-box">
          <div className="modal-header">
            <h3 className="modal-title">Schedule CSR Activity</h3>
            <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
          </div>
          <form onSubmit={createCsrActivity}>
            <div className="form-group">
              <label>CSR Activity Title</label>
              <input type="text" className="form-control" required placeholder="e.g. Clean Energy Hackathon" value={csrTitle} onChange={e => setCsrTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Activity Brief Description</label>
              <input type="text" className="form-control" required placeholder="e.g. Developing software for home energy reduction." value={csrDesc} onChange={e => setCsrDesc(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Points/XP Awarded</label>
              <input type="number" className="form-control" required value={csrPoints} onChange={e => setCsrPoints(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Maximum Participants Allowed</label>
              <input type="number" className="form-control" required value={csrLimit} onChange={e => setCsrLimit(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Scheduled Date</label>
              <input type="date" className="form-control" required value={csrDate} onChange={e => setCsrDate(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Schedule Activity</button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal: Submit Evidence Proof */}
      <div className={`modal-overlay ${activeModal === 'proof' ? 'active' : ''}`}>
        <div className="modal-box">
          <div className="modal-header">
            <h3 className="modal-title">Submit Participation Evidence</h3>
            <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
          </div>
          <form onSubmit={submitProof}>
            <div className="form-group">
              <label>Evidence Attachment Link / Document URL</label>
              <input type="text" className="form-control" required placeholder="e.g. https://storage.local/proofs/activity_pic.jpg" value={proofUrl} onChange={e => setProofUrl(e.target.value)} />
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              <i data-lucide="info" style={{ width: "14px", height: "14px", verticalAlign: "middle" }}></i> Note: Evidence validation is active. Points are only awarded upon verification of proof by managers.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit Participation Proof</button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast notifications rendering */}
      <div className="toast-container">
        {toastQueue.map(toast => {
          let icon = <Info size={16} />;
          if (toast.type === "env") icon = <Leaf size={16} />;
          else if (toast.type === "soc") icon = <Users size={16} />;
          else if (toast.type === "gov") icon = <Shield size={16} />;
          else if (toast.type === "badge") icon = <Sparkles size={16} />;
          return (
            <div className={`toast ${toast.type}`} key={toast.id}>
              <div className="toast-icon">{icon}</div>
              <div>{toast.message}</div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
