// src/pages/Teacher/Reports.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import ChartCard from '../../components/Cards/ChartCard';
import MonthlyBarChart from '../../components/Charts/MonthlyBarChart';
import TeacherClassSelector from '../../components/TeacherClassSelector';

import { apiCache } from '../../utils/apiCache';

export default function TeacherReports() {
  const { authAxios } = useAuth();
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);

  const fetchStudents = useCallback((clsObj) => {
    if (!clsObj) {
      setStudents([]);
      return;
    }
    const cacheKey = `teacher_students_${clsObj.className}_${clsObj.section}`;
    const cached = apiCache.get(cacheKey);
    if (cached) {
      setStudents(cached);
    }
    authAxios.get(`/teacher/students?class=${encodeURIComponent(clsObj.className)}&section=${encodeURIComponent(clsObj.section)}`)
      .then(r => {
        apiCache.set(cacheKey, r.data.data);
        setStudents(r.data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass, fetchStudents]);

  const barData = students.map(s => ({
    month: s.studentName.split(' ')[0],
    score: parseFloat((s.growthIndex ?? 0).toFixed(1)),
  }));

  const avgGrowth = students.length
    ? (students.reduce((a, s) => a + s.growthIndex, 0) / students.length).toFixed(1)
    : 0;

  return (
    <div className="animate-fade">
      <TeacherClassSelector onClassSelect={setSelectedClass} />

      <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon navy"><span style={{ fontSize:'1.4rem' }}>📊</span></div>
          <div><div className="stat-val">{avgGrowth}</div><div className="stat-lbl">Class Avg Growth</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><span style={{ fontSize:'1.4rem' }}>👨‍🎓</span></div>
          <div><div className="stat-val">{students.length}</div><div className="stat-lbl">Total Students</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><span style={{ fontSize:'1.4rem' }}>⭐</span></div>
          <div>
            <div className="stat-val">{students.filter(s => s.growthIndex >= 81).length}</div>
            <div className="stat-lbl">Excellent Students</div>
          </div>
        </div>
      </div>

      <ChartCard title={`Growth Index per Student (${selectedClass ? `${selectedClass.className} ${selectedClass.section}` : 'Selected Class'})`} subtitle="Current scores">
        <MonthlyBarChart data={barData} domain={[0, 100]} />
      </ChartCard>
    </div>
  );
}

