import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type EventItem = {
  id: number
  title: string
  category: string
  venue: string
  eventDate: string
  status: string
  registrations: number
}

type EventForm = {
  title: string
  category: string
  venue: string
  eventDate: string
}

type RegistrationForm = {
  studentName: string
  studentEmail: string
}

type EventPass = {
  id: number
  token: string
  studentName: string
  eventId: number
  checkedInAt: string | null
}

type RegistrationItem = {
  id: number
  eventId: number
  studentName: string
  studentEmail: string
  status: string
  createdAt: string
}

type AnalyticsOverview = {
  activeEvents: number
  totalRegistrations: number
  checkedIn: number
  passIssued: number
}

type Announcement = {
  id: number
  title: string
  message: string
  audience: string
  createdAt: string
}

type AnnouncementForm = {
  title: string
  message: string
  audience: string
}

const apiUrl = 'http://localhost:8081/api/v1/events'
const emptyForm: EventForm = { title: '', category: 'Technology', venue: '', eventDate: '' }
const emptyRegistration: RegistrationForm = { studentName: '', studentEmail: '' }
const emptyAnnouncement: AnnouncementForm = { title: '', message: '', audience: 'All students' }

type AppView = 'dashboard' | 'login' | 'register' | 'access' | 'admin'
type Account = { userId: number; email: string; firstName: string; lastName: string; roles: string[] }

function AuthPage({ mode, onComplete, onSwitch }: { mode: 'login' | 'register'; onComplete: (account?: Account) => void; onSwitch: (view: AppView) => void }) {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' })
  const [error, setError] = useState('')
  const [adminLogin, setAdminLogin] = useState(false)
  const isRegister = mode === 'register'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const response = await fetch(`http://localhost:8081/api/v1/auth/${isRegister ? 'register' : 'login'}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    if (!response.ok) {
      setError(response.status === 409 ? 'An account with this email already exists.' : 'Check your details and try again.')
      return
    }
    const account = await response.json()
    localStorage.setItem('campus-flow-account', JSON.stringify(account))
    onComplete(account)
  }

  return <main className="auth-shell"><section className="auth-brand"><span className="brand-mark">CF</span><p className="eyebrow">CAMPUS FLOW</p><h1>Everything your<br /><em>campus</em> needs.</h1><p>Bring every event, student, and moment into one clear rhythm.</p></section><form className="auth-card" onSubmit={submit}><p className="eyebrow">{isRegister ? 'USER SIGNUP' : adminLogin ? 'ADMIN LOGIN' : 'WELCOME BACK'}</p><h2>{isRegister ? 'Create a user account' : adminLogin ? 'Admin sign in' : 'Sign in to Campus Flow'}</h2>{isRegister && <div className="name-fields"><label>First name<input required value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} /></label><label>Last name<input required value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} /></label></div>}<label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder={adminLogin ? 'lnctgroup@gmail.com' : 'you@college.edu'} /></label><label>Password<input required minLength={8} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button auth-submit" type="submit">{isRegister ? 'Create user account' : 'Sign in'} <span>→</span></button>{isRegister ? <div className="auth-options"><span>Are you an administrator?</span><button type="button" onClick={() => { setAdminLogin(true); onSwitch('login') }}>Admin login</button></div> : <div className="auth-options"><button type="button" className={!adminLogin ? 'selected-option' : ''} onClick={() => setAdminLogin(false)}>User login</button><button type="button" className={adminLogin ? 'selected-option' : ''} onClick={() => setAdminLogin(true)}>Admin login</button></div>}<p className="auth-switch">{isRegister ? 'Already have an account?' : 'Need a user account?'} <button type="button" onClick={() => { setAdminLogin(false); onSwitch(isRegister ? 'login' : 'register') }}>{isRegister ? 'Sign in' : 'User signup'}</button></p><button type="button" className="back-link" onClick={() => onComplete()}>← Back to dashboard</button></form></main>
}

function AccessPage({ onBack }: { onBack: () => void }) {
  const roles = [['STUDENT', 'Browse events, register, and manage passes'], ['ORGANIZER', 'Create events and manage registrations'], ['ADMIN', 'Approve events and manage the platform'], ['VOLUNTEER', 'View assigned tasks and shifts'], ['JUDGE', 'Submit competition scores']]
  const permissions = ['EVENT_CREATE', 'EVENT_APPROVE', 'REGISTRATION_VIEW', 'PAYMENT_REFUND', 'RESULT_PUBLISH', 'ANALYTICS_VIEW']
  return <main className="access-shell"><header className="access-header"><div className="brand"><span className="brand-mark">CF</span><span>Campus Flow</span></div><button className="back-link" onClick={onBack}>← Dashboard</button></header><section className="access-content"><p className="eyebrow">ACCESS CONTROL</p><h1>Roles & permissions</h1><p className="access-intro">A clear permission model keeps every campus workflow accountable.</p><div className="access-grid"><section className="access-panel"><h2>Roles</h2>{roles.map(([name, description]) => <article className="role-row" key={name}><span className="role-badge">{name.slice(0, 1)}</span><div><strong>{name}</strong><p>{description}</p></div></article>)}</section><section className="access-panel"><h2>Permissions</h2>{permissions.map((permission) => <div className="permission-row" key={permission}><span>✓</span><strong>{permission}</strong></div>)}</section></div></section></main>
}

type AdminSection = 'overview' | 'users' | 'events' | 'access'

function AdminOverview() {
  return <><p className="eyebrow">PLATFORM CONTROL CENTER</p><h1>Good morning, Administrator</h1><p className="access-intro">Manage the people, permissions, and activity that keep campus life moving.</p><section className="admin-metrics"><article><strong>5</strong><span>Active roles</span><small>Student to judge</small></article><article><strong>6</strong><span>Permissions</span><small>Full admin access</small></article><article><strong>2</strong><span>Live events</span><small>Currently published</small></article><article><strong>3</strong><span>Registrations</span><small>Across campus</small></article></section><div className="admin-grid"><section className="access-panel"><div className="card-heading"><h2>System status</h2><span className="admin-status">All systems active</span></div><div className="permission-row"><span className="role-dot"></span><strong>API and database</strong><small className="admin-status">Healthy</small></div><div className="permission-row"><span className="role-dot"></span><strong>Authentication</strong><small className="admin-status">Healthy</small></div></section><section className="access-panel"><div className="card-heading"><h2>Admin access</h2></div><p className="admin-copy">You have every platform permission, including event approval, refunds, result publishing, and analytics.</p></section></div></>
}

function AdminUsers() {
  return <><p className="eyebrow">DIRECTORY</p><h1>User management</h1><p className="access-intro">Review campus accounts and their assigned access levels.</p><section className="access-panel admin-table"><div className="table-row table-head"><strong>User</strong><strong>Role</strong><strong>Status</strong></div>{[['LNCT Administrator', 'lnctgroup@gmail.com', 'ADMIN'], ['Student accounts', 'Students registered on Campus Flow', 'STUDENT'], ['Event organizers', 'Organizers with event access', 'ORGANIZER']].map(([name, email, role]) => <div className="table-row" key={role}><div><strong>{name}</strong><small>{email}</small></div><strong>{role}</strong><span className="admin-status">Active</span></div>)}</section></>
}

function AdminEvents() {
  return <><p className="eyebrow">OPERATIONS</p><h1>Event administration</h1><p className="access-intro">Review event activity and keep publishing workflows moving.</p><section className="admin-grid"><section className="access-panel"><h2>Approval queue</h2><div className="permission-row"><span className="role-dot"></span><strong>Events awaiting review</strong><span className="admin-status">0</span></div><div className="permission-row"><span className="role-dot"></span><strong>Published events</strong><span className="admin-status">2</span></div></section><section className="access-panel"><h2>Participation</h2><div className="permission-row"><span>↗</span><strong>Total registrations</strong><span className="admin-status">3</span></div><div className="permission-row"><span>✓</span><strong>Checked-in students</strong><span className="admin-status">1</span></div></section></section></>
}

function AdminAccess() {
  const permissions = ['EVENT_CREATE', 'EVENT_APPROVE', 'REGISTRATION_VIEW', 'PAYMENT_REFUND', 'RESULT_PUBLISH', 'ANALYTICS_VIEW']
  return <><p className="eyebrow">ACCESS CONTROL</p><h1>Roles & permissions</h1><p className="access-intro">The administrator account has every permission in the platform registry.</p><div className="admin-grid"><section className="access-panel"><h2>Roles</h2>{['STUDENT', 'ORGANIZER', 'ADMIN', 'VOLUNTEER', 'JUDGE'].map((role) => <div className="permission-row" key={role}><span className="role-dot"></span><strong>{role}</strong><small className="admin-status">Active</small></div>)}</section><section className="access-panel"><h2>Administrator permissions</h2>{permissions.map((permission) => <div className="permission-row" key={permission}><span>✓</span><strong>{permission}</strong><small className="admin-status">Granted</small></div>)}</section></div></>
}

function AdminPage({ account, onSignOut }: { account: Account | null; onSignOut: () => void }) {
  const [section, setSection] = useState<AdminSection>('overview')
  const content = section === 'users' ? <AdminUsers /> : section === 'events' ? <AdminEvents /> : section === 'access' ? <AdminAccess /> : <AdminOverview />
  return <main className="admin-shell"><header className="admin-header"><div className="brand"><span className="brand-mark">CF</span><span>Campus Flow Admin</span></div><div className="admin-user"><span className="avatar">LA</span><span>{account?.email}</span><button className="back-link" onClick={onSignOut}>Sign out</button></div></header><div className="admin-layout"><nav className="admin-nav"><p className="eyebrow">ADMIN CONSOLE</p><button className={section === 'overview' ? 'admin-nav-item active' : 'admin-nav-item'} onClick={() => setSection('overview')}>Overview</button><button className={section === 'users' ? 'admin-nav-item active' : 'admin-nav-item'} onClick={() => setSection('users')}>Users</button><button className={section === 'events' ? 'admin-nav-item active' : 'admin-nav-item'} onClick={() => setSection('events')}>Events</button><button className={section === 'access' ? 'admin-nav-item active' : 'admin-nav-item'} onClick={() => setSection('access')}>Roles & permissions</button></nav><section className="admin-content">{content}</section></div></main>
}

function formatDate(date: string) {
  const value = new Date(`${date}T00:00:00`)
  return { day: value.getDate(), month: value.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() }
}

function App() {
  const [view, setView] = useState<AppView>('login')
  const [account, setAccount] = useState<Account | null>(null)
  const [events, setEvents] = useState<EventItem[]>([])
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsOverview>({ activeEvents: 0, totalRegistrations: 0, checkedIn: 0, passIssued: 0 })
  const [form, setForm] = useState<EventForm>(emptyForm)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [eventPass, setEventPass] = useState<EventPass | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>(emptyRegistration)
  const [announcementForm, setAnnouncementForm] = useState<AnnouncementForm>(emptyAnnouncement)
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetch(apiUrl), fetch('http://localhost:8081/api/v1/registrations'), fetch('http://localhost:8081/api/v1/analytics/overview'), fetch('http://localhost:8081/api/v1/announcements')])
      .then(async ([eventsResponse, registrationsResponse, analyticsResponse, announcementsResponse]) => {
        if (!eventsResponse.ok || !registrationsResponse.ok || !analyticsResponse.ok || !announcementsResponse.ok) throw new Error('Could not load dashboard data')
        const loadedEvents = await eventsResponse.json() as EventItem[]
        const loadedRegistrations = await registrationsResponse.json() as RegistrationItem[]
        const loadedAnalytics = await analyticsResponse.json() as AnalyticsOverview
        const loadedAnnouncements = await announcementsResponse.json() as Announcement[]
        return { loadedEvents, loadedRegistrations, loadedAnalytics, loadedAnnouncements }
      })
      .then(({ loadedEvents, loadedRegistrations, loadedAnalytics, loadedAnnouncements }) => {
        setEvents(loadedEvents)
        setRegistrations(loadedRegistrations)
        setAnalytics(loadedAnalytics)
        setAnnouncements(loadedAnnouncements)
      })
      .catch(() => setError('The event service is unavailable. Start the backend on port 8081.'))
      .finally(() => setIsLoading(false))
  }, [])

  if (view === 'login' || view === 'register') return <AuthPage mode={view} onComplete={(authenticatedAccount) => { if (authenticatedAccount) { setAccount(authenticatedAccount); setView(authenticatedAccount.roles.includes('ADMIN') ? 'admin' : 'dashboard') } else { setView('dashboard') } }} onSwitch={setView} />
  if (view === 'access') return <AccessPage onBack={() => setView('dashboard')} />
  if (view === 'admin') return <AdminPage account={account} onSignOut={() => { setAccount(null); setView('login') }} />

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!response.ok) {
      setError('Please complete every field and choose a future date.')
      return
    }
    const created = await response.json() as EventItem
    setEvents((current) => [...current, created].sort((a, b) => a.eventDate.localeCompare(b.eventDate)))
    setForm(emptyForm)
    setIsFormOpen(false)
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedEvent) return
    setError('')
    const response = await fetch(`${apiUrl}/${selectedEvent.id}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationForm),
    })
    if (!response.ok) {
      setError(response.status === 409 ? 'This email is already registered for the event.' : 'Please enter a valid name and email.')
      return
    }
    const registration = await response.json() as { id: number }
    const passResponse = await fetch(`http://localhost:8081/api/v1/registrations/${registration.id}/pass`)
    const pass = await passResponse.json() as EventPass
    setEventPass(pass)
    setEvents((current) => current.map((item) => item.id === selectedEvent.id ? { ...item, registrations: item.registrations + 1 } : item))
    setRegistrationForm(emptyRegistration)
    setIsRegistrationOpen(false)
  }

  async function handleAnnouncement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const response = await fetch('http://localhost:8081/api/v1/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcementForm),
    })
    if (!response.ok) {
      setError('Please complete the announcement fields.')
      return
    }
    const created = await response.json() as Announcement
    setAnnouncements((current) => [created, ...current])
    setAnnouncementForm(emptyAnnouncement)
    setIsAnnouncementOpen(false)
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">CF</span><span>Campus Flow</span></div>
        <nav aria-label="Main navigation">
          <a className="nav-item active" href="#overview">Overview</a>
          <a className="nav-item" href="#events">Events <span>{events.length}</span></a>
          <a className="nav-item" href="#registrations">Registrations</a>
          <a className="nav-item" href="#volunteers">Volunteers</a>
          <a className="nav-item" href="#announcements">Announcements</a>
          <button className="nav-item nav-button" onClick={() => setView('access')}>Roles & permissions</button>
        </nav>
        <div className="sidebar-footer"><span className="avatar">{account?.firstName?.[0] ?? 'U'}{account?.lastName?.[0] ?? ''}</span><div><strong>{account ? `${account.firstName} ${account.lastName}` : 'Campus user'}</strong><small>{account?.roles?.[0] ?? 'Student'}</small></div><button className="dots sign-out" onClick={() => setView('login')} aria-label="Sign in">↗</button></div>
      </aside>
      <section className="content" id="overview">
        <header className="topbar"><div><p className="eyebrow">SATURDAY, 20 SEPTEMBER 2026</p><h1>Good morning, {account?.firstName ?? 'there'}</h1></div><div className="top-actions"><button className="icon-button" aria-label="Notifications">♢</button><button className="primary-button" onClick={() => setIsFormOpen(true)}>+ Create event</button></div></header>
        <section className="welcome-panel"><div><p className="eyebrow">YOUR CAMPUS, IN MOTION</p><h2>Make every moment<br /><em>count.</em></h2><p className="panel-copy">One calm place to run the events that bring your campus together.</p></div><div className="panel-stats"><div><strong>{events.reduce((total, item) => total + item.registrations, 0).toLocaleString()}</strong><span>Students reached</span></div><div><strong>{events.length}</strong><span>Active events</span></div></div></section>
        <div className="section-heading"><div><p className="eyebrow">AT A GLANCE</p><h2>Event pulse</h2></div><a href="#analytics">View analytics →</a></div>
        <section className="metrics"><article><span className="metric-icon coral">◈</span><div><strong>{analytics.activeEvents}</strong><span>Active events</span></div><small className="positive">Live from API</small></article><article><span className="metric-icon teal">↗</span><div><strong>{analytics.totalRegistrations.toLocaleString()}</strong><span>Total registrations</span></div><small className="positive">Across all events</small></article><article><span className="metric-icon yellow">◉</span><div><strong>{analytics.checkedIn}</strong><span>Students checked in</span></div><small className="neutral">Pass scans</small></article><article><span className="metric-icon blue">▣</span><div><strong>{analytics.passIssued}</strong><span>Passes issued</span></div><small className="positive">Ready for entry</small></article></section>
        <section className="dashboard-grid"><div className="events-card" id="events"><div className="card-heading"><div><p className="eyebrow">UP NEXT</p><h2>Upcoming events</h2></div><button className="link-button" onClick={() => setIsFormOpen(true)}>+ Add event</button></div>{isLoading && <p className="empty-state">Loading events...</p>}{!isLoading && events.length === 0 && <p className="empty-state">No events yet. Create the first one.</p>}{events.map((item, index) => { const date = formatDate(item.eventDate); return <div className="event-row" key={item.id}><div className={`date-tile ${index % 3 === 1 ? 'yellow-tile' : index % 3 === 2 ? 'blue-tile' : ''}`}><strong>{date.day}</strong><span>{date.month}</span></div><div className="event-info"><h3>{item.title}</h3><p>{item.category} · {item.venue}</p></div><button className="register-button" onClick={() => { setSelectedEvent(item); setIsRegistrationOpen(true) }}>Register</button><span className="event-count">{item.registrations} <small>joined</small></span></div> })}</div><div className="activity-card" id="registrations"><div className="card-heading"><div><p className="eyebrow">REGISTRATION DESK</p><h2>Recent registrations</h2></div><span className="activity-count">{registrations.length}</span></div>{registrations.length === 0 && <p className="activity-empty">No registrations yet.</p>}{registrations.slice(0, 4).map((registration, index) => <div className="activity" key={registration.id}><span className={`activity-dot ${index % 2 === 0 ? 'teal-dot' : 'coral-dot'}`}></span><div><p><strong>{registration.studentName}</strong> joined {events.find((item) => item.id === registration.eventId)?.title ?? 'an event'}</p><small>{registration.studentEmail}</small></div></div>)}</div></section>
        <section className="announcement-strip" id="announcements"><div className="announcement-heading"><div><p className="eyebrow">CAMPUS VOICE</p><h2>Announcements</h2></div><button className="link-button" onClick={() => setIsAnnouncementOpen(true)}>+ Publish</button></div>{announcements.length === 0 && <p className="activity-empty">No announcements yet.</p>}{announcements.slice(0, 3).map((announcement) => <article className="announcement" key={announcement.id}><span className="announcement-mark">!</span><div><h3>{announcement.title}</h3><p>{announcement.message}</p><small>{announcement.audience}</small></div></article>)}</section>
        {error && <p className="error-message" role="alert">{error}</p>}
      </section>
      {isFormOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsFormOpen(false)}><form className="event-form" onSubmit={handleCreate}><div className="card-heading"><div><p className="eyebrow">NEW WORKFLOW</p><h2>Create event</h2></div><button type="button" className="close-button" onClick={() => setIsFormOpen(false)} aria-label="Close">×</button></div><label>Event name<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Innovation Summit" /></label><label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Technology</option><option>Cultural</option><option>Sports</option><option>Workshop</option><option>Seminar</option></select></label><label>Venue<input required value={form.venue} onChange={(event) => setForm({ ...form, venue: event.target.value })} placeholder="e.g. Main Auditorium" /></label><label>Date<input required type="date" value={form.eventDate} onChange={(event) => setForm({ ...form, eventDate: event.target.value })} /></label><button className="primary-button form-submit" type="submit">Create event</button></form></div>}
      {isRegistrationOpen && selectedEvent && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsRegistrationOpen(false)}><form className="event-form" onSubmit={handleRegister}><div className="card-heading"><div><p className="eyebrow">STUDENT REGISTRATION</p><h2>{selectedEvent.title}</h2></div><button type="button" className="close-button" onClick={() => setIsRegistrationOpen(false)} aria-label="Close">×</button></div><label>Student name<input required value={registrationForm.studentName} onChange={(event) => setRegistrationForm({ ...registrationForm, studentName: event.target.value })} placeholder="e.g. Priya Shah" /></label><label>Student email<input required type="email" value={registrationForm.studentEmail} onChange={(event) => setRegistrationForm({ ...registrationForm, studentEmail: event.target.value })} placeholder="student@college.edu" /></label><button className="primary-button form-submit" type="submit">Confirm registration</button></form></div>}
      {eventPass && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setEventPass(null)}><section className="pass-card"><p className="eyebrow">REGISTRATION CONFIRMED</p><h2>Your event pass</h2><p className="pass-name">{eventPass.studentName}</p><div className="pass-code">{eventPass.token}</div><p className="pass-help">Show this pass at the event check-in desk.</p><button className="primary-button form-submit" onClick={() => setEventPass(null)}>Done</button></section></div>}
      {isAnnouncementOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsAnnouncementOpen(false)}><form className="event-form" onSubmit={handleAnnouncement}><div className="card-heading"><div><p className="eyebrow">CAMPUS VOICE</p><h2>Publish announcement</h2></div><button type="button" className="close-button" onClick={() => setIsAnnouncementOpen(false)} aria-label="Close">×</button></div><label>Title<input required value={announcementForm.title} onChange={(event) => setAnnouncementForm({ ...announcementForm, title: event.target.value })} placeholder="e.g. Venue update" /></label><label>Message<textarea required value={announcementForm.message} onChange={(event) => setAnnouncementForm({ ...announcementForm, message: event.target.value })} placeholder="Write an update for students" rows={4} /></label><label>Audience<select value={announcementForm.audience} onChange={(event) => setAnnouncementForm({ ...announcementForm, audience: event.target.value })}><option>All students</option><option>Event participants</option><option>Volunteers</option></select></label><button className="primary-button form-submit" type="submit">Publish announcement</button></form></div>}
    </main>
  )
}

export default App
