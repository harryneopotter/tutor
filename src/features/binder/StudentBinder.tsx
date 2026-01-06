import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../../store/appStore';
import { binderRepo } from '../../repositories/binder';
import { LessonPlan, SyllabusTopic } from '../../types';
import { Input as UIInput } from '../../ui/components/Input';
import { TextArea as UITextArea } from '../../ui/components/TextArea';
import { Card as UICard } from '../../ui/components/Card';
import { Button as UIButton } from '../../ui/components/Button';
import { useToast } from '../../ui/components/ToastProvider';
import { Download, Plus, Book, FileText, GraduationCap } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme.colors.surface0};
  color: ${({ theme }) => theme.colors.ink900};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 12px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.ink900};
  margin: 0;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;


const Select = styled.select`
  padding: 8px 16px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface1};
  color: ${({ theme }) => theme.colors.ink900};
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow.skeuoRaised};
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.brand}; }
`;

const TabList = styled.div`
  display: flex;
  margin: 0 32px;
  background: rgba(0,0,0,0.05);
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.lg};
  width: fit-content;
  gap: 4px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 20px;
  border: none;
  background: ${p => (p.$active ? p.theme.colors.surface1 : 'transparent')};
  color: ${p => (p.$active ? p.theme.colors.ink900 : p.theme.colors.ink600)};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${p => (p.$active ? '0 4px 12px rgba(0,0,0,0.05)' : 'none')};
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover { color: ${p => p.theme.colors.brand}; }
`;

const Content = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 24px;
  overflow: auto;
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
  padding: 12px 16px;
  background: rgba(255,255,255,0.4);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all 0.2s ease;
  &:hover { transform: translateX(4px); background: rgba(255,255,255,0.6); }
`;

export const StudentBinder: React.FC = () => {
  const { students } = useAppStore();
  const { showToast } = useToast();
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
    showToast(`Topic "${topic.topic}" added`, 'success');
  };

  const addPlan = async (plan: Omit<LessonPlan, 'id' | 'studentId'>) => {
    if (!studentId) return;
    const p: LessonPlan = { id: crypto.randomUUID(), studentId, ...plan };
    setPlans(prev => [...prev, p]);
    await binderRepo.addLessonPlan(p);
    showToast(`Lesson plan for "${plan.topic}" saved`, 'success');
  };

  const [topicForm, setTopicForm] = useState({ month: '', topic: '', page: '' });
  const [planForm, setPlanForm] = useState({ topic: '', date: '', durationMin: 60, resources: '', notes: '' });

  return (
    <Container>
      <Header>
        <Title>
          <GraduationCap size={28} />
          Student Binder
        </Title>
        <Controls>
          <Select aria-label="Student" value={studentId} onChange={e => setStudentId(e.target.value)}>
            {students.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
          </Select>
          <UIButton
            variant="secondary"
            onClick={async () => {
              if (!studentId) return;
              try {
                const student = students.find(s => s.id === studentId);
                const classes = JSON.parse(JSON.stringify((await import('../../store/appStore')).useAppStore.getState().events.filter(e => e.studentId === studentId)));
                const manifest = {
                  version: 1,
                  exportedAt: new Date().toISOString(),
                  studentId,
                  files: ['student.json', 'syllabus.json', 'lessonPlans.json', 'classes.json']
                };
                const { default: JSZip } = await import('jszip');
                const zip = new JSZip();
                zip.file('student.json', JSON.stringify(student, null, 2));
                zip.file('syllabus.json', JSON.stringify(syllabus, null, 2));
                zip.file('lessonPlans.json', JSON.stringify(plans, null, 2));
                zip.file('classes.json', JSON.stringify(classes, null, 2));
                zip.file('manifest.json', JSON.stringify(manifest, null, 2));
                const blob = await zip.generateAsync({ type: 'blob' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${student?.name?.replace(/\s+/g, '_') || 'student'}_binder.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('Binder exported successfully', 'success');
              } catch (e) {
                showToast('Failed to export binder', 'error');
              }
            }}
          >
            <Download size={14} style={{ marginRight: 8 }} />
            Export ZIP
          </UIButton>
        </Controls>
      </Header>

      <TabList>
        <Tab $active={activeTab === 'syllabus'} onClick={() => setActiveTab('syllabus')}>
          <Book size={16} />
          Syllabus
        </Tab>
        <Tab $active={activeTab === 'plans'} onClick={() => setActiveTab('plans')}>
          <FileText size={16} />
          Lesson Plans
        </Tab>
      </TabList>

      <Content>
        {activeTab === 'syllabus' ? (
          <>
            <UICard glass padding="none" style={{ padding: 24, alignSelf: 'start' }}>
              <Title style={{ fontSize: 18, marginBottom: 20 }}>Add Topic</Title>
              <div style={{ display: 'grid', gap: 12 }}>
                <UIInput placeholder="Month (e.g., Sep)" value={topicForm.month} onChange={e => setTopicForm({ ...topicForm, month: e.target.value })} />
                <UIInput placeholder="Topic" value={topicForm.topic} onChange={e => setTopicForm({ ...topicForm, topic: e.target.value })} />
                <UIInput placeholder="Page (optional)" value={topicForm.page} onChange={e => setTopicForm({ ...topicForm, page: e.target.value })} />
                <UIButton
                  variant="primary"
                  onClick={() => { if (topicForm.month && topicForm.topic) { addTopic({ month: topicForm.month, topic: topicForm.topic, page: topicForm.page || undefined }); setTopicForm({ month: '', topic: '', page: '' }); } }}
                >
                  <Plus size={16} />
                  Add
                </UIButton>
              </div>
            </UICard>
            <UICard glass padding="none" style={{ padding: 24 }}>
              <Title style={{ fontSize: 18, marginBottom: 20 }}>Topics</Title>
              <List>
                {syllabus.length === 0 && <div style={{ opacity: 0.5, textAlign: 'center', padding: 20 }}>No topics added yet.</div>}
                {syllabus.map(t => (
                  <Row key={t.id}>
                    <div style={{ fontWeight: 600 }}>{t.month}</div>
                    <div>{t.topic}{t.page ? ` (p.${t.page})` : ''}</div>
                  </Row>
                ))}
              </List>
            </UICard>
          </>
        ) : (
          <>
            <UICard glass padding="none" style={{ padding: 24, alignSelf: 'start' }}>
              <Title style={{ fontSize: 18, marginBottom: 20 }}>Add Lesson Plan</Title>
              <div style={{ display: 'grid', gap: 12 }}>
                <UIInput placeholder="Topic" value={planForm.topic} onChange={e => setPlanForm({ ...planForm, topic: e.target.value })} />
                <UIInput placeholder="Date (YYYY-MM-DD)" value={planForm.date} onChange={e => setPlanForm({ ...planForm, date: e.target.value })} />
                <UIInput type="number" min={30} step={30} placeholder="Duration (min)" value={planForm.durationMin} onChange={e => setPlanForm({ ...planForm, durationMin: parseInt(e.target.value) || 60 })} />
                <UIInput placeholder="Resources (comma separated URLs)" value={planForm.resources} onChange={e => setPlanForm({ ...planForm, resources: e.target.value })} />
                <UITextArea placeholder="Notes" value={planForm.notes} onChange={e => setPlanForm({ ...planForm, notes: e.target.value })} rows={4} />
                <UIButton
                  variant="primary"
                  onClick={() => { if (planForm.topic && planForm.date) { addPlan({ topic: planForm.topic, date: planForm.date, durationMin: planForm.durationMin, resources: planForm.resources ? planForm.resources.split(',').map(s => s.trim()) : undefined, notes: planForm.notes || undefined }); setPlanForm({ topic: '', date: '', durationMin: 60, resources: '', notes: '' }); } }}
                >
                  <Plus size={16} />
                  Add Plan
                </UIButton>
              </div>
            </UICard>
            <UICard glass padding="none" style={{ padding: 24 }}>
              <Title style={{ fontSize: 18, marginBottom: 20 }}>Lesson Plans</Title>
              <List>
                {plans.length === 0 && <div style={{ opacity: 0.5, textAlign: 'center', padding: 20 }}>No lesson plans saved yet.</div>}
                {plans.map(p => (
                  <Row key={p.id}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.topic}</div>
                      <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{p.date} • {p.durationMin} min</div>
                    </div>
                  </Row>
                ))}
              </List>
            </UICard>
          </>
        )}
      </Content>
    </Container>
  );
};
