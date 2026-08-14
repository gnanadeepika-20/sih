import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { getLevelInfo } from '@/lib/skillEngine';

export default function ProfilePage() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!profile) return null;

  const levelInfo = getLevelInfo(profile.xp);

  async function handleSave() {
    setSaving(true);
    const { error } = await updateProfile({ name });
    if (!error) {
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const interests = profile.interests ?? [];

  return (
    <div className="min-h-screen bg-ink-50 section-padding py-8 max-w-3xl mx-auto">
      <PageHeader title="Your Profile" subtitle="Manage your account and preferences." />

      {/* Profile card */}
      <div className="card p-8 mb-6 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sq-500 to-sq-700 flex items-center justify-center text-white text-2xl font-extrabold shadow-soft">
            {profile.name?.charAt(0).toUpperCase() ?? 'E'}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input py-2"
                  placeholder="Your name"
                />
                <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => { setEditing(false); setName(profile.name); }} className="btn-ghost text-sm">
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-extrabold text-ink-900">{profile.name}</h2>
                <p className="text-sm text-ink-500">{user?.email}</p>
              </>
            )}
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-ghost text-sm">
              <Icon name="PenLine" className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {saved && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold animate-fade-in">
            Profile updated!
          </div>
        )}

        {/* Level and XP */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-amber2-50 text-center">
            <div className="text-2xl font-extrabold text-amber2-700 tabular-nums">{profile.xp.toLocaleString()}</div>
            <div className="text-xs text-amber2-600 font-semibold mt-1">Total XP</div>
          </div>
          <div className="p-4 rounded-xl bg-sq-50 text-center">
            <div className="text-2xl font-extrabold text-sq-700">Lv.{levelInfo.level}</div>
            <div className="text-xs text-sq-600 font-semibold mt-1">{levelInfo.name}</div>
          </div>
          <div className="p-4 rounded-xl bg-coral-50 text-center">
            <div className="text-2xl font-extrabold text-coral-700">{profile.streak}</div>
            <div className="text-xs text-coral-600 font-semibold mt-1">Day Streak</div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-ink-50">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="BookOpen" className="w-4 h-4 text-ink-400" />
              <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">Education</span>
            </div>
            <p className="font-semibold text-ink-700">{profile.education_level ?? 'Not set'}</p>
          </div>
          <div className="p-4 rounded-xl bg-ink-50">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="User" className="w-4 h-4 text-ink-400" />
              <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">Situation</span>
            </div>
            <p className="font-semibold text-ink-700">{profile.current_situation ?? 'Not set'}</p>
          </div>
          <div className="p-4 rounded-xl bg-ink-50 sm:col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="Sparkles" className="w-4 h-4 text-ink-400" />
              <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">Discovery Goal</span>
            </div>
            <p className="font-semibold text-ink-700">{profile.discovery_goal ?? 'Not set'}</p>
          </div>
          <div className="p-4 rounded-xl bg-ink-50 sm:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Compass" className="w-4 h-4 text-ink-400" />
              <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">Interests</span>
            </div>
            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span key={interest} className="badge bg-sq-50 text-sq-700 text-xs">{interest}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-400">No interests selected</p>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-lg font-bold text-ink-900 mb-4">Quest Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-ink-50">
            <span className="font-semibold text-ink-700 text-sm">Onboarding</span>
            <span className={`badge text-xs ${profile.onboarding_completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber2-50 text-amber2-700'}`}>
              {profile.onboarding_completed ? 'Complete' : 'Incomplete'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-ink-50">
            <span className="font-semibold text-ink-700 text-sm">Assessment</span>
            <span className={`badge text-xs ${profile.assessment_completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber2-50 text-amber2-700'}`}>
              {profile.assessment_completed ? 'Complete' : 'Incomplete'}
            </span>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <button onClick={handleSignOut} className="btn-secondary w-full text-coral-600 border-coral-200 hover:border-coral-400 hover:bg-coral-50">
        <Icon name="LogOut" className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}
