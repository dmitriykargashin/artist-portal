import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { join } from 'path'
import { randomUUID } from 'crypto'
import * as schema from './schema'

// Ensure the directory exists
import { mkdirSync, existsSync, unlinkSync } from 'fs'

const dbPath = join(process.cwd(), 'server', 'db', 'dev.sqlite')
const dbDir = join(process.cwd(), 'server', 'db')
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
}

// Remove existing database if exists
if (existsSync(dbPath)) {
  unlinkSync(dbPath)
  console.log('🗑️  Removed existing database')
}

const sqlite = new Database(dbPath)
sqlite.pragma('journal_mode = WAL')
const db = drizzle(sqlite, { schema })

// Helper functions
const uuid = () => randomUUID()
const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000)
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000)

async function seed() {
  console.log('🌱 Starting database seed...\n')

  // Create tables
  console.log('📋 Creating tables...')
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      avatar_url TEXT,
      role TEXT NOT NULL DEFAULT 'artist',
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS artist_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      genre TEXT,
      bio TEXT,
      goals TEXT,
      social_links TEXT,
      monthly_listeners INTEGER,
      followers INTEGER,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      price_monthly REAL NOT NULL,
      price_yearly REAL,
      features TEXT,
      deliverables TEXT,
      sessions_per_month INTEGER DEFAULT 0,
      response_sla TEXT,
      is_popular INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      plan_id TEXT NOT NULL REFERENCES plans(id),
      status TEXT NOT NULL DEFAULT 'active',
      current_period_start INTEGER,
      current_period_end INTEGER,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS addons (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      delivery_days INTEGER NOT NULL,
      scope TEXT,
      requirements TEXT,
      active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      addon_id TEXT NOT NULL REFERENCES addons(id),
      project_id TEXT REFERENCES projects(id),
      amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'completed',
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      progress INTEGER DEFAULT 0,
      start_date INTEGER,
      due_date INTEGER,
      completed_at INTEGER,
      meta TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS deliverables (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id),
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'not_started',
      priority TEXT DEFAULT 'medium',
      due_date INTEGER,
      completed_at INTEGER,
      assigned_to TEXT REFERENCES users(id),
      meta TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS deliverable_comments (
      id TEXT PRIMARY KEY,
      deliverable_id TEXT NOT NULL REFERENCES deliverables(id),
      author_id TEXT NOT NULL REFERENCES users(id),
      content TEXT NOT NULL,
      is_internal INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY,
      deliverable_id TEXT REFERENCES deliverables(id),
      project_id TEXT REFERENCES projects(id),
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      type TEXT,
      size INTEGER,
      uploaded_by TEXT REFERENCES users(id),
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      session_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      start_at INTEGER NOT NULL,
      end_at INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled',
      meeting_url TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id),
      author_id TEXT NOT NULL REFERENCES users(id),
      content TEXT NOT NULL,
      attachment_url TEXT,
      read_at INTEGER,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      link_url TEXT,
      read_at INTEGER,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS metrics (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      date INTEGER NOT NULL,
      value REAL NOT NULL,
      meta TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      target INTEGER NOT NULL,
      current INTEGER DEFAULT 0,
      period TEXT NOT NULL,
      start_date INTEGER,
      end_date INTEGER,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      type TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      meta TEXT,
      created_at INTEGER NOT NULL
    );
  `)

  // Seed Users
  console.log('👤 Seeding users...')
  const artistUserId = 'user_artist_demo'
  const adminUserId = 'user_admin_demo'

  db.insert(schema.users).values([
    {
      id: artistUserId,
      email: 'artist@demo.com',
      name: 'Jordan Rivers',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
      role: 'artist',
      createdAt: daysAgo(90)
    },
    {
      id: adminUserId,
      email: 'admin@demo.com',
      name: 'Alex Morgan',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      role: 'admin',
      createdAt: daysAgo(180)
    }
  ]).run()

  // Seed Artist Profile
  console.log('🎨 Seeding artist profile...')
  db.insert(schema.artistProfiles).values({
    id: uuid(),
    userId: artistUserId,
    genre: 'Indie Pop / Electronic',
    bio: 'Emerging indie-electronic artist blending dreamy synths with heartfelt lyrics. Based in LA, creating music that feels like a late-night drive through neon-lit streets.',
    goals: ['Release EP by Q2', 'Reach 50k monthly listeners', 'Book 10 live shows'],
    socialLinks: {
      spotify: 'https://spotify.com/artist/demo',
      instagram: '@jordanrivers',
      tiktok: '@jordanriversmusic',
      youtube: 'JordanRiversOfficial'
    },
    monthlyListeners: 23450,
    followers: 15200,
    createdAt: daysAgo(90)
  } as any).run()

  // Seed Plans
  console.log('📦 Seeding plans...')
  const planStandardId = 'plan_standard'
  const planPremiumId = 'plan_premium'
  const planDeluxeId = 'plan_deluxe'

  db.insert(schema.plans).values([
    {
      id: planStandardId,
      name: 'Standard',
      slug: 'standard',
      description: 'Essential services for emerging artists ready to grow their presence.',
      priceMonthly: 499,
      priceYearly: 4990,
      features: [
        'Monthly content calendar',
        'Social media management (2 platforms)',
        'Basic analytics reporting',
        'Email support (48h response)',
        'Asset library access'
      ],
      deliverables: [
        { name: 'Social posts', count: 12 },
        { name: 'Story designs', count: 8 },
        { name: 'Monthly report', count: 1 }
      ],
      sessionsPerMonth: 1,
      responseSla: '48 hours',
      isPopular: false,
      active: true,
      sortOrder: 1,
      createdAt: daysAgo(365)
    },
    {
      id: planPremiumId,
      name: 'Premium',
      slug: 'premium',
      description: 'Comprehensive support for artists ready to level up their career.',
      priceMonthly: 999,
      priceYearly: 9990,
      features: [
        'Everything in Standard',
        'Social media management (4 platforms)',
        'Spotify playlist pitching',
        'Press release writing',
        'Priority support (24h response)',
        'Dedicated account manager',
        'Bi-weekly strategy calls'
      ],
      deliverables: [
        { name: 'Social posts', count: 24 },
        { name: 'Story designs', count: 16 },
        { name: 'Reels/TikToks', count: 4 },
        { name: 'Press releases', count: 2 },
        { name: 'Monthly report', count: 1 }
      ],
      sessionsPerMonth: 2,
      responseSla: '24 hours',
      isPopular: true,
      active: true,
      sortOrder: 2,
      createdAt: daysAgo(365)
    },
    {
      id: planDeluxeId,
      name: 'Deluxe',
      slug: 'deluxe',
      description: 'Full-service agency partnership for established artists.',
      priceMonthly: 2499,
      priceYearly: 24990,
      features: [
        'Everything in Premium',
        'Full social media takeover',
        'Spotify campaign management',
        'PR & media outreach',
        'Influencer partnerships',
        'Ad campaign management',
        'VIP support (same-day response)',
        'Weekly strategy calls',
        'Exclusive industry connections'
      ],
      deliverables: [
        { name: 'Social posts', count: 40 },
        { name: 'Story designs', count: 30 },
        { name: 'Reels/TikToks', count: 8 },
        { name: 'Press releases', count: 4 },
        { name: 'Blog features', count: 2 },
        { name: 'Monthly report', count: 1 }
      ],
      sessionsPerMonth: 4,
      responseSla: 'Same day',
      isPopular: false,
      active: true,
      sortOrder: 3,
      createdAt: daysAgo(365)
    }
  ] as any).run()

  // Seed Subscription
  console.log('💳 Seeding subscriptions...')
  db.insert(schema.subscriptions).values({
    id: uuid(),
    userId: artistUserId,
    planId: planPremiumId,
    status: 'active',
    currentPeriodStart: daysAgo(15),
    currentPeriodEnd: daysFromNow(15),
    createdAt: daysAgo(60)
  }).run()

  // Seed Addons
  console.log('🛒 Seeding addons...')
  const addonIds: string[] = []
  const addonsData = [
    // Social
    { name: 'Instagram Audit & Strategy', slug: 'ig-audit', category: 'social', description: 'Deep-dive analysis of your Instagram presence with actionable growth strategy.', price: 299, deliveryDays: 5, scope: ['Profile optimization recommendations', 'Content strategy plan', 'Hashtag research', 'Competitor analysis', 'Growth roadmap'] },
    { name: 'TikTok Launch Package', slug: 'tiktok-launch', category: 'social', description: 'Everything you need to launch and grow on TikTok.', price: 599, deliveryDays: 7, scope: ['Account setup & optimization', '10 video concepts', 'Trending audio strategy', 'Posting schedule', 'First 5 video scripts'] },
    { name: 'Social Media Content Pack', slug: 'social-content-pack', category: 'social', description: '30 custom-designed posts ready to publish.', price: 449, deliveryDays: 10, scope: ['30 feed posts', '15 story templates', 'Caption templates', 'Brand guidelines adherence'] },
    // Spotify
    { name: 'Spotify Profile Optimization', slug: 'spotify-optimization', category: 'spotify', description: 'Maximize your Spotify presence for playlist consideration.', price: 199, deliveryDays: 3, scope: ['Artist bio writing', 'Profile image recommendations', 'Canvas strategy', 'Playlist pitch template', 'About section optimization'] },
    { name: 'Playlist Pitching Campaign', slug: 'playlist-pitching', category: 'spotify', description: 'Professional pitching to 50+ independent playlist curators.', price: 399, deliveryDays: 14, scope: ['Curator research', 'Personalized pitches to 50+ playlists', 'Follow-up management', 'Placement report', 'Playlist tracker access'] },
    // Branding
    { name: 'Visual Identity Package', slug: 'visual-identity', category: 'branding', description: 'Complete visual branding for your artist project.', price: 1299, deliveryDays: 14, scope: ['Logo design (3 concepts)', 'Color palette', 'Typography system', 'Social media templates', 'Press kit template', 'Brand guidelines PDF'] },
    { name: 'Album Artwork Design', slug: 'album-artwork', category: 'branding', description: 'Custom artwork for your next release.', price: 499, deliveryDays: 7, scope: ['Main cover art', '3 revision rounds', 'All platform sizes', 'Vinyl-ready version', 'Promotional variations'] },
    // PR
    { name: 'Press Release + Distribution', slug: 'press-release', category: 'pr', description: 'Professional press release with distribution to music media.', price: 349, deliveryDays: 5, scope: ['Professionally written release', 'Distribution to 100+ outlets', 'Media list targeting', 'Follow-up emails', 'Coverage report'] },
    { name: 'Blog Feature Campaign', slug: 'blog-features', category: 'pr', description: 'Guaranteed features on music blogs and publications.', price: 799, deliveryDays: 21, scope: ['3 guaranteed features', 'Blog research & outreach', 'Interview coordination', 'Quote preparation', 'Coverage documentation'] },
    // Ads
    { name: 'Spotify Ad Campaign', slug: 'spotify-ads', category: 'ads', description: 'Managed Spotify advertising campaign for your release.', price: 699, deliveryDays: 30, scope: ['Ad creative development', 'Audience targeting setup', 'Campaign management (30 days)', '$300 ad spend included', 'Performance reporting'] },
    { name: 'Social Ads Starter', slug: 'social-ads', category: 'ads', description: 'Meta ads campaign to grow your fanbase.', price: 549, deliveryDays: 14, scope: ['Ad creative design (3 variations)', 'Audience setup', 'Campaign management (14 days)', '$200 ad spend included', 'Retargeting setup'] },
    // Strategy
    { name: 'Release Strategy Session', slug: 'release-strategy', category: 'strategy', description: '90-minute strategy session for your upcoming release.', price: 249, deliveryDays: 1, scope: ['Pre-call questionnaire', '90-minute video call', 'Release timeline', 'Marketing checklist', 'Recording of session', 'Follow-up notes'] }
  ]

  for (const addon of addonsData) {
    const id = uuid()
    addonIds.push(id)
    db.insert(schema.addons).values({
      id,
      name: addon.name,
      slug: addon.slug,
      category: addon.category as any,
      description: addon.description,
      price: addon.price,
      deliveryDays: addon.deliveryDays,
      scope: addon.scope,
      requirements: ['Brief/questionnaire completion', 'Asset access if needed'],
      active: true,
      sortOrder: addonIds.length,
      createdAt: daysAgo(180)
    } as any).run()
  }

  // Seed Projects
  console.log('📁 Seeding projects...')
  const projectIds = {
    monthly: uuid(),
    single: uuid(),
    branding: uuid(),
    playlist: uuid()
  }

  db.insert(schema.projects).values([
    {
      id: projectIds.monthly,
      userId: artistUserId,
      title: 'January 2026 Monthly Retainer',
      description: 'Premium plan deliverables for January 2026',
      type: 'subscription',
      status: 'active',
      progress: 65,
      startDate: daysAgo(15),
      dueDate: daysFromNow(15),
      meta: { month: 'January', year: 2026 },
      createdAt: daysAgo(15)
    },
    {
      id: projectIds.single,
      userId: artistUserId,
      title: '"Neon Dreams" Single Release',
      description: 'Full release campaign for upcoming single',
      type: 'addon',
      status: 'active',
      progress: 40,
      startDate: daysAgo(7),
      dueDate: daysFromNow(21),
      meta: { releaseDate: daysFromNow(21).toISOString() },
      createdAt: daysAgo(7)
    },
    {
      id: projectIds.branding,
      userId: artistUserId,
      title: 'Visual Identity Refresh',
      description: 'Complete rebrand for 2026',
      type: 'addon',
      status: 'active',
      progress: 80,
      startDate: daysAgo(30),
      dueDate: daysFromNow(5),
      createdAt: daysAgo(30)
    },
    {
      id: projectIds.playlist,
      userId: artistUserId,
      title: 'Q4 2025 Playlist Campaign',
      description: 'Playlist pitching for catalog tracks',
      type: 'addon',
      status: 'completed',
      progress: 100,
      startDate: daysAgo(60),
      dueDate: daysAgo(30),
      completedAt: daysAgo(28),
      meta: { playlistsSecured: 12, totalReach: 145000 },
      createdAt: daysAgo(60)
    }
  ] as any).run()

  // Seed Deliverables (25 total)
  console.log('📝 Seeding deliverables...')
  const deliverableData = [
    // Monthly project deliverables
    { projectId: projectIds.monthly, title: 'Week 1 Social Posts (6x)', status: 'approved', priority: 'medium', dueDate: daysAgo(8) },
    { projectId: projectIds.monthly, title: 'Week 1 Stories (4x)', status: 'approved', priority: 'medium', dueDate: daysAgo(8) },
    { projectId: projectIds.monthly, title: 'Week 2 Social Posts (6x)', status: 'approved', priority: 'medium', dueDate: daysAgo(1) },
    { projectId: projectIds.monthly, title: 'Week 2 Stories (4x)', status: 'review', priority: 'medium', dueDate: daysAgo(1) },
    { projectId: projectIds.monthly, title: 'Week 3 Social Posts (6x)', status: 'in_progress', priority: 'medium', dueDate: daysFromNow(6) },
    { projectId: projectIds.monthly, title: 'Week 3 Stories (4x)', status: 'not_started', priority: 'medium', dueDate: daysFromNow(6) },
    { projectId: projectIds.monthly, title: 'Week 4 Social Posts (6x)', status: 'not_started', priority: 'medium', dueDate: daysFromNow(13) },
    { projectId: projectIds.monthly, title: 'Week 4 Stories (4x)', status: 'not_started', priority: 'medium', dueDate: daysFromNow(13) },
    { projectId: projectIds.monthly, title: 'January Reels (4x)', status: 'in_progress', priority: 'high', dueDate: daysFromNow(10) },
    { projectId: projectIds.monthly, title: 'January Analytics Report', status: 'not_started', priority: 'low', dueDate: daysFromNow(15) },
    // Single release deliverables
    { projectId: projectIds.single, title: 'Single Artwork', status: 'review', priority: 'urgent', dueDate: daysFromNow(3) },
    { projectId: projectIds.single, title: 'Press Release Draft', status: 'in_progress', priority: 'high', dueDate: daysFromNow(5) },
    { projectId: projectIds.single, title: 'Spotify Canvas', status: 'not_started', priority: 'medium', dueDate: daysFromNow(14) },
    { projectId: projectIds.single, title: 'Playlist Pitch Package', status: 'in_progress', priority: 'high', dueDate: daysFromNow(7) },
    { projectId: projectIds.single, title: 'Release Day Social Kit', status: 'not_started', priority: 'high', dueDate: daysFromNow(18) },
    { projectId: projectIds.single, title: 'Pre-save Campaign Setup', status: 'approved', priority: 'urgent', dueDate: daysAgo(2) },
    { projectId: projectIds.single, title: 'Influencer Outreach List', status: 'in_progress', priority: 'medium', dueDate: daysFromNow(10) },
    // Branding deliverables
    { projectId: projectIds.branding, title: 'Logo Concepts (3x)', status: 'approved', priority: 'high', dueDate: daysAgo(20) },
    { projectId: projectIds.branding, title: 'Color Palette', status: 'approved', priority: 'high', dueDate: daysAgo(15) },
    { projectId: projectIds.branding, title: 'Typography System', status: 'approved', priority: 'medium', dueDate: daysAgo(15) },
    { projectId: projectIds.branding, title: 'Social Templates', status: 'review', priority: 'medium', dueDate: daysFromNow(2) },
    { projectId: projectIds.branding, title: 'Brand Guidelines PDF', status: 'in_progress', priority: 'medium', dueDate: daysFromNow(5) },
    // Completed playlist project
    { projectId: projectIds.playlist, title: 'Curator Research', status: 'approved', priority: 'high', dueDate: daysAgo(55) },
    { projectId: projectIds.playlist, title: 'Pitch Templates', status: 'approved', priority: 'high', dueDate: daysAgo(50) },
    { projectId: projectIds.playlist, title: 'Campaign Report', status: 'approved', priority: 'medium', dueDate: daysAgo(30) }
  ]

  const deliverableIds: string[] = []
  for (let i = 0; i < deliverableData.length; i++) {
    const d = deliverableData[i]
    const id = uuid()
    deliverableIds.push(id)
    db.insert(schema.deliverables).values({
      id,
      projectId: d.projectId,
      title: d.title,
      description: `Deliverable for ${d.title}`,
      status: d.status as any,
      priority: d.priority as any,
      dueDate: d.dueDate,
      completedAt: d.status === 'approved' ? daysAgo(1) : null,
      assignedTo: adminUserId,
      sortOrder: i,
      createdAt: daysAgo(20)
    }).run()
  }

  // Seed Deliverable Comments
  console.log('💬 Seeding comments...')
  const comments = [
    { deliverableId: deliverableIds[10], authorId: adminUserId, content: 'First draft ready for review! Let me know if you want any adjustments to the color treatment.', isInternal: false },
    { deliverableId: deliverableIds[10], authorId: artistUserId, content: 'Love the direction! Can we try a version with more contrast?', isInternal: false },
    { deliverableId: deliverableIds[10], authorId: adminUserId, content: 'Absolutely! I\'ll have a new version ready by tomorrow.', isInternal: false },
    { deliverableId: deliverableIds[11], authorId: adminUserId, content: 'Working on the hook angle. Client has great streaming numbers to highlight.', isInternal: true }
  ]

  for (const comment of comments) {
    db.insert(schema.deliverableComments).values({
      id: uuid(),
      deliverableId: comment.deliverableId,
      authorId: comment.authorId,
      content: comment.content,
      isInternal: comment.isInternal,
      createdAt: daysAgo(Math.floor(Math.random() * 5))
    }).run()
  }

  // Seed Messages
  console.log('✉️ Seeding messages...')
  const messagesData = [
    { projectId: projectIds.single, authorId: adminUserId, content: 'Hey Jordan! Excited to kick off the Neon Dreams campaign. I\'ve reviewed the track and have some great ideas for the visual direction.' },
    { projectId: projectIds.single, authorId: artistUserId, content: 'Thanks Alex! Can\'t wait to see what you come up with. I\'m thinking something with that late-night city vibe.' },
    { projectId: projectIds.single, authorId: adminUserId, content: 'Perfect - that aligns with what I was thinking. I\'ll have some mood boards ready by EOD.' },
    { projectId: projectIds.single, authorId: artistUserId, content: 'Sounds great! Also, should we talk about the pre-save strategy on our next call?' },
    { projectId: projectIds.single, authorId: adminUserId, content: 'Definitely. I\'ll add it to the agenda. We should aim to launch pre-save 2 weeks before release.' },
    { projectId: projectIds.branding, authorId: adminUserId, content: 'Brand guidelines are almost done! Just finalizing the social template section.' },
    { projectId: projectIds.branding, authorId: artistUserId, content: 'Amazing work on this project. The new look is exactly what I envisioned!' },
    { projectId: projectIds.monthly, authorId: adminUserId, content: 'January content is looking strong. The engagement on last week\'s posts was up 23%!' },
    { projectId: projectIds.monthly, authorId: artistUserId, content: 'That\'s incredible! The new content strategy is really working.' },
    { projectId: projectIds.monthly, authorId: adminUserId, content: 'Agreed! Let\'s keep the momentum going. I\'m working on some trending audio ideas for this week\'s reels.' }
  ]

  for (let i = 0; i < messagesData.length; i++) {
    db.insert(schema.messages).values({
      id: uuid(),
      projectId: messagesData[i].projectId,
      authorId: messagesData[i].authorId,
      content: messagesData[i].content,
      readAt: i < 8 ? daysAgo(1) : null,
      createdAt: daysAgo(10 - i)
    }).run()
  }

  // Seed Bookings
  console.log('📅 Seeding bookings...')
  db.insert(schema.bookings).values([
    {
      id: uuid(),
      userId: artistUserId,
      sessionType: 'strategy',
      title: 'Q1 Strategy Planning',
      description: 'Review Q1 goals and plan campaign priorities',
      startAt: daysFromNow(3),
      endAt: new Date(daysFromNow(3).getTime() + 60 * 60 * 1000),
      status: 'scheduled',
      meetingUrl: 'https://meet.example.com/artist-portal/q1-strategy',
      createdAt: daysAgo(5)
    },
    {
      id: uuid(),
      userId: artistUserId,
      sessionType: 'content_planning',
      title: 'February Content Planning',
      description: 'Plan content calendar for February',
      startAt: daysFromNow(10),
      endAt: new Date(daysFromNow(10).getTime() + 45 * 60 * 1000),
      status: 'scheduled',
      meetingUrl: 'https://meet.example.com/artist-portal/feb-content',
      createdAt: daysAgo(2)
    },
    {
      id: uuid(),
      userId: artistUserId,
      sessionType: 'review',
      title: 'December Review Call',
      description: 'Monthly performance review and insights',
      startAt: daysAgo(20),
      endAt: new Date(daysAgo(20).getTime() + 60 * 60 * 1000),
      status: 'completed',
      notes: 'Great progress on engagement. Focus on video content for Q1.',
      createdAt: daysAgo(30)
    }
  ]).run()

  // Seed Notifications
  console.log('🔔 Seeding notifications...')
  const notificationsData = [
    { userId: artistUserId, type: 'deliverable', title: 'Single Artwork Ready for Review', content: 'Alex has uploaded a new version of your single artwork.', linkUrl: '/app/deliverables' },
    { userId: artistUserId, type: 'booking', title: 'Upcoming Session Tomorrow', content: 'Reminder: Q1 Strategy Planning session is tomorrow at 2pm.', linkUrl: '/app/schedule' },
    { userId: artistUserId, type: 'project', title: 'Project Milestone Reached', content: 'Your Visual Identity Refresh project is 80% complete!', linkUrl: '/app/projects' },
    { userId: artistUserId, type: 'message', title: 'New Message from Alex', content: 'January content is looking strong...', linkUrl: '/app/projects' },
    { userId: adminUserId, type: 'deliverable', title: 'Review Requested', content: 'Jordan has requested a revision on Single Artwork.', linkUrl: '/admin/deliverables' },
    { userId: adminUserId, type: 'system', title: 'New Artist Signup', content: 'A new artist has signed up for the Premium plan.', linkUrl: '/admin/artists' }
  ]

  for (let i = 0; i < notificationsData.length; i++) {
    const n = notificationsData[i]
    db.insert(schema.notifications).values({
      id: uuid(),
      userId: n.userId,
      type: n.type as any,
      title: n.title,
      content: n.content,
      linkUrl: n.linkUrl,
      readAt: i < 3 ? null : daysAgo(1),
      createdAt: daysAgo(i)
    }).run()
  }

  // Seed Metrics (12 weeks of data)
  console.log('📊 Seeding metrics...')
  const metricTypes = ['content_cadence', 'campaign_progress', 'completion_rate', 'engagement']
  for (let week = 12; week >= 0; week--) {
    const date = daysAgo(week * 7)
    for (const type of metricTypes) {
      let value: number
      switch (type) {
        case 'content_cadence':
          value = Math.floor(Math.random() * 8) + 4 // 4-12 posts per week
          break
        case 'campaign_progress':
          value = Math.min(100, 30 + (12 - week) * 6 + Math.floor(Math.random() * 10))
          break
        case 'completion_rate':
          value = 70 + Math.floor(Math.random() * 25) // 70-95%
          break
        case 'engagement':
          value = 2 + Math.random() * 4 // 2-6% engagement rate
          break
        default:
          value = 50
      }
      db.insert(schema.metrics).values({
        id: uuid(),
        userId: artistUserId,
        type: type as any,
        date,
        value,
        createdAt: date
      }).run()
    }
  }

  // Seed Goals
  console.log('🎯 Seeding goals...')
  db.insert(schema.goals).values([
    {
      id: uuid(),
      userId: artistUserId,
      title: 'Weekly Posts',
      type: 'posts_per_week',
      target: 6,
      current: 4,
      period: 'weekly',
      startDate: daysAgo(7),
      endDate: daysFromNow(0),
      createdAt: daysAgo(30)
    },
    {
      id: uuid(),
      userId: artistUserId,
      title: 'Monthly Deliverables',
      type: 'deliverables_per_month',
      target: 20,
      current: 13,
      period: 'monthly',
      startDate: daysAgo(15),
      endDate: daysFromNow(15),
      createdAt: daysAgo(30)
    },
    {
      id: uuid(),
      userId: artistUserId,
      title: 'Strategy Sessions',
      type: 'sessions_per_month',
      target: 2,
      current: 1,
      period: 'monthly',
      startDate: daysAgo(15),
      endDate: daysFromNow(15),
      createdAt: daysAgo(30)
    }
  ]).run()

  // Seed Activities
  console.log('📜 Seeding activities...')
  const activitiesData = [
    { userId: artistUserId, type: 'deliverable', action: 'approved', entityType: 'deliverable', entityId: deliverableIds[0] },
    { userId: adminUserId, type: 'deliverable', action: 'uploaded', entityType: 'deliverable', entityId: deliverableIds[10] },
    { userId: artistUserId, type: 'message', action: 'sent', entityType: 'project', entityId: projectIds.single },
    { userId: adminUserId, type: 'project', action: 'updated', entityType: 'project', entityId: projectIds.branding },
    { userId: artistUserId, type: 'booking', action: 'scheduled', entityType: 'booking', entityId: null }
  ]

  for (let i = 0; i < activitiesData.length; i++) {
    const a = activitiesData[i]
    db.insert(schema.activities).values({
      id: uuid(),
      userId: a.userId,
      type: a.type,
      action: a.action,
      entityType: a.entityType,
      entityId: a.entityId,
      createdAt: daysAgo(i)
    }).run()
  }

  console.log('\n✅ Database seeded successfully!')
  console.log('\n📊 Summary:')
  console.log('   - 2 users (artist + admin)')
  console.log('   - 3 plans')
  console.log('   - 12 addons')
  console.log('   - 4 projects')
  console.log('   - 25 deliverables')
  console.log('   - 10 messages')
  console.log('   - 3 bookings')
  console.log('   - 52 metrics (12 weeks × 4 types)')
  console.log('   - 3 goals')
  console.log('   - 6 notifications')
  console.log('   - 5 activities\n')
  console.log('🔑 Demo Credentials:')
  console.log('   Artist: artist@demo.com')
  console.log('   Admin: admin@demo.com')
  console.log('   Passcode: DEMO2026\n')
}

seed().catch(console.error)
