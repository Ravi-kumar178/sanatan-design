/**
 * Unified Spiritual Icon Set — Saffron Line-Art Style
 * All icons follow the same visual language: thin saffron line-art on transparent background
 * Use these URLs consistently across the entire site.
 */

export const ICONS = {
  // Core spiritual symbols
  om:          '/Images/icon-om_a07c1c41.png',
  lotus:       '/Images/icon-lotus_855e6a37.png',

  // Three pillars
  health:      '/Images/icon-yoga-pose_4498527a.png',      // Yoga/meditation = Health pillar
  education:   '/Images/icon-scroll_bd9f434f.png',          // Scroll/scripture = Education pillar
  technology:  '/Images/icon-tech-lotus_d69ab604.png',      // Circuit+lotus = Technology pillar

  // Gurukul
  gurukul:     '/Images/icon-gurukul-teacher_690a9246.png', // Teacher under banyan
  ayurveda:    '/Images/icon-ayurveda-mortar_16433074.png', // Mortar & pestle

  // Actions & community
  donate:      '/Images/icon-giving-hands_3d326c73.png',    // Giving hands
  community:   '/Images/icon-community_532fbf5c.png',        // People circle
  calendar:    '/Images/icon-calendar_a8b7eec7.png',         // Calendar with lotus
  research:    '/Images/icon-research_3199c3d9.png',         // Microscope + leaf
} as const;

/** Hero background images for every page */
export const HERO_IMAGES = {
  home:       '/Images/hero-hyperreal_6f2c3d1a.jpg',
  foundation: '/Images/hero-lotus-temple_3a8b2c4d.jpg',
  programs:   '/Images/hero-programs_5d59cfd0.jpg',
  digital:    '/Images/hero-bg_8f4e2a1b.jpg',
  ayurveda:   '/Images/hero-bg_8f4e2a1b.jpg',
  join:       '/Images/hero-join_68aaa02a.jpg',
  metaGurukul:'/Images/hero-bg_8f4e2a1b.jpg',
  hub:        '/Images/hero-hub_272617ae.jpg',
  blog:       '/Images/hero-blog_8266e789.jpg',
  donate:     '/Images/hero-donate_d5dc4d38.jpg',
  events:     '/Images/hero-events_f624d697.jpg',
  contact:    '/Images/hero-contact_2eff3046.jpg',
  volunteer:  '/Images/hero-volunteer_68a795af.jpg',
} as const;
