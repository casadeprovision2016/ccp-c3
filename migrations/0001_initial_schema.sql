-- D1 initial schema

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'leader', 'member')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE members (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  birth_date TEXT,
  baptism_date TEXT,
  membership_date TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'transferred')),
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE visitors (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  visit_date TEXT NOT NULL,
  source TEXT,
  interested_in TEXT,
  notes TEXT,
  followed_up INTEGER DEFAULT 0,
  follow_up_needed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TEXT NOT NULL,
  end_date TEXT,
  location TEXT,
  event_type TEXT CHECK (event_type IN ('service', 'conference', 'outreach', 'meeting', 'other')),
  image_url TEXT,
  status TEXT CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')) DEFAULT 'scheduled',
  follow_up_needed INTEGER DEFAULT 0,
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE ministries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  leader_id TEXT REFERENCES members(id),
  meeting_schedule TEXT,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE ministry_members (
  ministry_id TEXT REFERENCES ministries(id) ON DELETE CASCADE,
  member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
  joined_date TEXT DEFAULT (date('now')),
  role TEXT,
  PRIMARY KEY (ministry_id, member_id)
);

CREATE TABLE donations (
  id TEXT PRIMARY KEY,
  donor_name TEXT,
  amount REAL NOT NULL,
  donation_type TEXT CHECK (donation_type IN ('tithe', 'offering', 'mission', 'building', 'other')),
  payment_method TEXT CHECK (payment_method IN ('cash', 'transfer', 'pix', 'card', 'other')),
  donation_date TEXT NOT NULL,
  notes TEXT,
  receipt_number TEXT UNIQUE,
  follow_up_needed INTEGER DEFAULT 0,
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE pastoral_visits (
  id TEXT PRIMARY KEY,
  member_id TEXT REFERENCES members(id),
  visitor_id TEXT REFERENCES visitors(id),
  visit_date TEXT NOT NULL,
  visit_type TEXT CHECK (visit_type IN ('home', 'hospital', 'counseling', 'other')),
  pastor_id TEXT REFERENCES users(id),
  notes TEXT,
  follow_up_needed INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE streams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  stream_url TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('youtube', 'facebook', 'vimeo', 'other')),
  scheduled_date TEXT NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'live', 'ended')) DEFAULT 'scheduled',
  thumbnail_url TEXT,
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_members_birth_date ON members(birth_date);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_donations_date ON donations(donation_date);
CREATE INDEX idx_pastoral_visits_date ON pastoral_visits(visit_date);
CREATE INDEX idx_streams_scheduled_date ON streams(scheduled_date);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
