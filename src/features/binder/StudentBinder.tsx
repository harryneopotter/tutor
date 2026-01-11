import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppStore } from '../../store/appStore';
import { binderRepo } from '../../repositories/binder';
import { LessonPlan, SyllabusTopic } from '../../types';
import { Input as UIInput } from '../../ui/components/Input';
import { TextArea as UITextArea } from '../../ui/components/TextArea';
import { Card as UICard } from '../../ui/components/Card';
import { Button as UIButton } from '../../ui/components/Button';
import { Modal as UIModal } from '../../ui/components/Modal';
import { useToast } from '../../ui/components/ToastProvider';
import { validateStudentData, sanitizeString } from '../../utils/validation';
import { Download, Plus, Book, FileText, GraduationCap, User } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: transparent;
  color: ${({ theme }) => theme.colors.ink900};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    padding: 16px 16px 8px;
    align-items: stretch;
    gap: 16px;
  }
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

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    & > * { width: 100%; }
  }
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
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.lg};
  width: fit-content;
  gap: 4px;
  border: 1px solid rgba(255,255,255,0.2);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin: 8px 16px;
    width: auto;
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
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

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    padding: 16px;
  }
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

const RowItem = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.ink400};
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const RelationSection = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(0,0,0,0.05);
`;

const SiblingTag = styled.button<{ $linked?: boolean }>`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid ${p => p.$linked ? p.theme.colors.brand : 'rgba(0,0,0,0.1)'};
  background: ${p => p.$linked ? p.theme.colors.surface1 : 'transparent'};
  color: ${p => p.$linked ? p.theme.colors.brand : p.theme.colors.ink600};
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand};
    color: ${({ theme }) => theme.colors.brand};
    transform: translateY(-1px);
  }
`;

interface ProfileForm {
  age: string | number;
  dob: string;
  school: string;
  classDetails: string;
  binderNotes: string;
  siblingIds: string[];
}

const StudentProfile: React.FC<{
  student?: any;
  allStudents: any[];
  onUpdate: (updates: any) => void;
  onSwitch: (id: string) => void;
}> = ({ student, allStudents, onUpdate, onSwitch }) => {
  const [form, setForm] = useState<ProfileForm>({
    age: student?.age || '',
    dob: student?.dob || '',
    school: student?.school || '',
    classDetails: student?.classDetails || '',
    binderNotes: student?.binderNotes || '',
    siblingIds: student?.siblingIds || []
  });

  useEffect(() => {
    if (student) {
      setForm({
        age: student.age || '',
        dob: student.dob || '',
        school: student.school || '',
        classDetails: student.classDetails || '',
        binderNotes: student.binderNotes || '',
        siblingIds: student.siblingIds || []
      });
    }
  }, [student]);

  const toggleSibling = (id: string) => {
    const current = [...(form.siblingIds || [])];
    if (current.includes(id)) {
      setForm({ ...form, siblingIds: current.filter(sid => sid !== id) });
    } else {
      setForm({ ...form, siblingIds: [...current, id] });
    }
  };

  const handleSave = () => {
    const validation = validateStudentData({
      name: student.name, // Required from existing student
      grade: student.grade, // Required from existing student
      age: form.age,
      dob: form.dob,
      school: form.school,
      classDetails: form.classDetails,
      binderNotes: form.binderNotes,
    });

    if (!validation.valid) {
      // Use toast to show error
      const toast = (window as any).__showToast;
      if (toast) {
        toast(validation.error || 'Invalid input', 'error');
      } else {
        alert(validation.error);
      }
      return;
    }

    onUpdate({
      age: form.age ? parseInt(form.age.toString()) : undefined,
      dob: sanitizeString(form.dob, 50),
      school: sanitizeString(form.school, 200),
      classDetails: sanitizeString(form.classDetails, 200),
      binderNotes: sanitizeString(form.binderNotes, 5000),
      siblingIds: form.siblingIds,
    });
  };

  if (!student) return <div style={{ opacity: 0.5, textAlign: 'center', padding: 40 }}>Select a student to view profile.</div>;

  return (
    <div style={{ gridColumn: '1 / span 2', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <UICard glass padding="none" style={{ padding: 32 }}>
        <Title style={{ fontSize: 20, marginBottom: 32 }}>Student Profile</Title>
        <ProfileGrid>
          <RowItem>
            <Label>Age</Label>
            <UIInput type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
          </RowItem>
          <RowItem>
            <Label>Date of Birth</Label>
            <UIInput type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
          </RowItem>
          <RowItem>
            <Label>School</Label>
            <UIInput value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} />
          </RowItem>
          <RowItem>
            <Label>Class Details</Label>
            <UIInput value={form.classDetails} onChange={e => setForm({ ...form, classDetails: e.target.value })} />
          </RowItem>
        </ProfileGrid>

        <div style={{ marginTop: 24 }}>
          <Label style={{ marginBottom: 12, display: 'block' }}>Student Notes</Label>
          <UITextArea
            placeholder="Academic goals, strengths, weaknesses..."
            value={form.binderNotes}
            onChange={e => setForm({ ...form, binderNotes: e.target.value })}
            rows={6}
          />
        </div>

        <RelationSection>
          <Label style={{ marginBottom: 16, display: 'block' }}>Siblings & Relationships</Label>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {allStudents.filter(s => s.id !== student.id).map(s => (
              <SiblingTag
                key={s.id}
                $linked={form.siblingIds.includes(s.id)}
                onClick={() => toggleSibling(s.id)}
              >
                {form.siblingIds.includes(s.id) ? '✓ ' : '+ '}
                {s.name}
              </SiblingTag>
            ))}
          </div>

          {form.siblingIds.length > 0 && (
            <div style={{ background: 'rgba(0,0,0,0.02)', padding: 12, borderRadius: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase' }}>Quick Switch:</span>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                {(form.siblingIds || []).map((sid: string) => {
                  const s = allStudents.find(o => o.id === sid);
                  if (!s) return null;
                  return (
                    <button
                      key={sid}
                      onClick={() => onSwitch(sid)}
                      style={{
                        background: 'none', border: 'none', padding: 0,
                        color: '#4F46E5', fontWeight: 700, fontSize: 13,
                        cursor: 'pointer', textDecoration: 'underline'
                      }}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </RelationSection>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
          <UIButton variant="primary" onClick={handleSave} style={{ padding: '12px 32px' }}>
            Save Profile Details
          </UIButton>
        </div>
      </UICard>
    </div>
  );
};

export const StudentBinder: React.FC = () => {
  const { students, addStudent } = useAppStore();
  const { showToast } = useToast();
  const [studentId, setStudentId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'profile' | 'syllabus' | 'plans'>('profile');
  const [syllabus, setSyllabus] = useState<SyllabusTopic[]>([]);
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({ name: '', grade: '' });

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
            variant="primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={14} style={{ marginRight: 8 }} />
            Add Student
          </UIButton>
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
        <Tab $active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
          <User size={16} />
          Profile
        </Tab>
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
        {activeTab === 'profile' ? (
          <StudentProfile
            student={students.find(s => s.id === studentId)}
            allStudents={students}
            onSwitch={(id) => setStudentId(id)}
            onUpdate={(updates) => {
              if (studentId) {
                useAppStore.getState().updateStudent(studentId, updates);
                showToast('Student profile updated', 'success');
              }
            }}
          />
        ) : activeTab === 'syllabus' ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <UICard glass padding="none" style={{ padding: 24 }}>
                <Title style={{ fontSize: 18, marginBottom: 12 }}>School Syllabus Reference</Title>
                <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 20 }}>
                  Paste the full school-provided syllabus requirements here for quick reference.
                </p>
                <UITextArea
                  placeholder="Paste school syllabus overview here..."
                  value={students.find(s => s.id === studentId)?.schoolSyllabus || ''}
                  onChange={e => {
                    if (studentId) {
                      useAppStore.getState().updateStudent(studentId, { schoolSyllabus: e.target.value });
                    }
                  }}
                  rows={12}
                  style={{ marginBottom: 16 }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <UIButton
                    variant="secondary"
                    size="sm"
                    onClick={() => showToast('Syllabus reference saved', 'success')}
                  >
                    Save Reference
                  </UIButton>
                </div>
              </UICard>

              <UICard glass padding="none" style={{ padding: 24 }}>
                <Title style={{ fontSize: 18, marginBottom: 20 }}>Add Topic Tracker</Title>
                <div style={{ display: 'grid', gap: 12 }}>
                  <UIInput placeholder="Month (e.g., Sep)" value={topicForm.month} onChange={e => setTopicForm({ ...topicForm, month: e.target.value })} />
                  <UIInput placeholder="Topic" value={topicForm.topic} onChange={e => setTopicForm({ ...topicForm, topic: e.target.value })} />
                  <UIInput placeholder="Page (optional)" value={topicForm.page} onChange={e => setTopicForm({ ...topicForm, page: e.target.value })} />
                  <UIButton
                    variant="primary"
                    onClick={() => { if (topicForm.month && topicForm.topic) { addTopic({ month: topicForm.month, topic: topicForm.topic, page: topicForm.page || undefined }); setTopicForm({ month: '', topic: '', page: '' }); } }}
                  >
                    <Plus size={16} />
                    Add Entry
                  </UIButton>
                </div>
              </UICard>
            </div>

            <UICard glass padding="none" style={{ padding: 24, height: 'fit-content' }}>
              <Title style={{ fontSize: 18, marginBottom: 20 }}>Completion Log</Title>
              <List>
                {syllabus.length === 0 && <div style={{ opacity: 0.5, textAlign: 'center', padding: 20 }}>No topics logged yet.</div>}
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

      {/* Add Student Modal */}
      <UIModal
        open={showAddModal}
        title="Add New Student"
        onClose={() => {
          setShowAddModal(false);
          setNewStudentForm({ name: '', grade: '' });
        }}
        footer={
          <>
            <UIButton variant="secondary" onClick={() => {
              setShowAddModal(false);
              setNewStudentForm({ name: '', grade: '' });
            }}>
              Cancel
            </UIButton>
            <UIButton
              variant="primary"
              onClick={() => {
                const validation = validateStudentData({
                  name: newStudentForm.name,
                  grade: newStudentForm.grade,
                });

                if (!validation.valid) {
                  showToast(validation.error || 'Invalid input', 'error');
                  return;
                }

                const sanitizedName = sanitizeString(newStudentForm.name, 100);
                const sanitizedGrade = sanitizeString(newStudentForm.grade, 50);

                addStudent({ name: sanitizedName, grade: sanitizedGrade });
                const newId = useAppStore.getState().students[useAppStore.getState().students.length - 1]?.id;
                if (newId) setStudentId(newId);
                showToast(`${sanitizedName} added successfully`, 'success');
                setShowAddModal(false);
                setNewStudentForm({ name: '', grade: '' });
              }}
            >
              Add Student
            </UIButton>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <Label style={{ marginBottom: 8, display: 'block' }}>Student Name *</Label>
            <UIInput
              placeholder="Enter student name"
              value={newStudentForm.name}
              onChange={e => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
              maxLength={100}
              autoFocus
            />
          </div>
          <div>
            <Label style={{ marginBottom: 8, display: 'block' }}>Grade *</Label>
            <UIInput
              placeholder="e.g., Grade 5, Year 10, 3rd Grade"
              value={newStudentForm.grade}
              onChange={e => setNewStudentForm({ ...newStudentForm, grade: e.target.value })}
              maxLength={50}
            />
          </div>
          <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', margin: 0, fontStyle: 'italic' }}>
            You can add additional details (age, DOB, school, etc.) after creating the student in the Profile tab.
          </p>
        </div>
      </UIModal>
    </Container>
  );
};
