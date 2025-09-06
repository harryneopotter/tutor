import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../store/appStore';
import { binderRepo } from '../repositories/binder';
import { LessonPlan, SyllabusTopic } from '../types';
import { format } from 'date-fns';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e1e5e9;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 12px;
  border: none;
  background: ${p => p.active ? '#3b82f6' : 'transparent'};
  color: ${p => p.active ? '#ffffff' : '#374151'};
  border-bottom: 2px solid ${p => p.active ? '#3b82f6' : 'transparent'};
  cursor: pointer;
`;

const Content = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 24px;
  overflow: auto;
`;

const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  resize: vertical;
  min-height: 60px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  ${p => p.variant === 'primary' ? `background:#3b82f6;border-color:#3b82f6;color:#fff;` : `background:#fff;border-color:#d1d5db;color:#374151;`}
`;

export const StudentBinder: React.FC = () => {
  const { students } = useAppStore();
  const [studentId, setStudentId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'syllabus' | 'plans'>('syllabus');
  const [syllabus, setSyllabus] = useState<SyllabusTopic[]>([]);
  const [plans, setPlans] = useState<LessonPlan[]>([]);

  useEffect(() => {
    if (students.length && !studentId) setStudentId(students[0].id);
  }, [students, studentId]);

  useEffect(() => {
    if (!studentId) return;
    (async () => {
      const [topics, lessonPlans] = await Promise.all([
        binderRepo.getSyllabusByStudent(studentId),
        binderRepo.getLessonPlansByStudent(studentId),
      ]);
      setSyllabus(topics);
      setPlans(lessonPlans);
    })();
  }, [studentId]);

  const addTopic = async (topic: Omit<SyllabusTopic, 'id' | 'studentId'>) => {
    if (!studentId) return;
    const t: SyllabusTopic = { id: crypto.randomUUID(), studentId, ...topic };
    setSyllabus(prev => [...prev, t]);
    await binderRepo.addSyllabusTopic(t);
  };

  const addPlan = async (plan: Omit<LessonPlan, 'id' | 'studentId'>) => {
    if (!studentId) return;
    const p: LessonPlan = { id: crypto.randomUUID(), studentId, ...plan };
    setPlans(prev => [...prev, p]);
    await binderRepo.addLessonPlan(p);
  };

  const [topicForm, setTopicForm] = useState({ month: '', topic: '', page: '' });
  const [planForm, setPlanForm] = useState({ topic: '', date: '', durationMin: 60, resources: '', notes: '' });

  return (
    <Container>
      <Header>
        <Title>Student Binder</Title>
        <Controls>
          <Select value={studentId} onChange={e => setStudentId(e.target.value)}>
            {students.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
          </Select>
        </Controls>
      </Header>

      <Tabs>
        <Tab active={activeTab === 'syllabus'} onClick={() => setActiveTab('syllabus')}>Syllabus</Tab>
        <Tab active={activeTab === 'plans'} onClick={() => setActiveTab('plans')}>Lesson Plans</Tab>
      </Tabs>

      <Content>
        {activeTab === 'syllabus' ? (
          <>
            <Card>
              <h4>Add Topic</h4>
              <div style={{ display: 'grid', gap: 8 }}>
                <Input placeholder="Month (e.g., Sep)" value={topicForm.month} onChange={e => setTopicForm({ ...topicForm, month: e.target.value })} />
                <Input placeholder="Topic" value={topicForm.topic} onChange={e => setTopicForm({ ...topicForm, topic: e.target.value })} />
                <Input placeholder="Page (optional)" value={topicForm.page} onChange={e => setTopicForm({ ...topicForm, page: e.target.value })} />
                <Button 
                  variant="primary"
                  onClick={() => { if (topicForm.month && topicForm.topic) { addTopic({ month: topicForm.month, topic: topicForm.topic, page: topicForm.page || undefined }); setTopicForm({ month: '', topic: '', page: '' }); } }}
                >Add</Button>
              </div>
            </Card>
            <Card>
              <h4>Topics</h4>
              <List>
                {syllabus.map(t => (
                  <Row key={t.id}>
                    <div>{t.month}: {t.topic}{t.page ? ` (p.${t.page})` : ''}</div>
                  </Row>
                ))}
              </List>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <h4>Add Lesson Plan</h4>
              <div style={{ display: 'grid', gap: 8 }}>
                <Input placeholder="Topic" value={planForm.topic} onChange={e => setPlanForm({ ...planForm, topic: e.target.value })} />
                <Input placeholder="Date (YYYY-MM-DD)" value={planForm.date} onChange={e => setPlanForm({ ...planForm, date: e.target.value })} />
                <Input type="number" min={30} step={30} placeholder="Duration (min)" value={planForm.durationMin} onChange={e => setPlanForm({ ...planForm, durationMin: parseInt(e.target.value) || 60 })} />
                <Input placeholder="Resources (comma separated URLs)" value={planForm.resources} onChange={e => setPlanForm({ ...planForm, resources: e.target.value })} />
                <TextArea placeholder="Notes" value={planForm.notes} onChange={e => setPlanForm({ ...planForm, notes: e.target.value })} />
                <Button 
                  variant="primary"
                  onClick={() => { if (planForm.topic && planForm.date) { addPlan({ topic: planForm.topic, date: planForm.date, durationMin: planForm.durationMin, resources: planForm.resources ? planForm.resources.split(',').map(s => s.trim()) : undefined, notes: planForm.notes || undefined }); setPlanForm({ topic: '', date: '', durationMin: 60, resources: '', notes: '' }); } }}
                >Add</Button>
              </div>
            </Card>
            <Card>
              <h4>Lesson Plans</h4>
              <List>
                {plans.map(p => (
                  <Row key={p.id}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.topic}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{p.date} • {p.durationMin} min</div>
                    </div>
                  </Row>
                ))}
              </List>
            </Card>
          </>
        )}
      </Content>
    </Container>
  );
};
