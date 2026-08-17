/**
 * LanguageContext — Geo-based auto language detection
 * South Asia (IN, PK, NP, AF, LK) → Hindi (hi)
 * Rest of world → English (en)
 * Sanskrit is used for verses, titles, and references in both modes.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'hi';

const SOUTH_ASIA = new Set(['IN', 'PK', 'NP', 'AF', 'LK']);

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LangCtx>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

// ─── Translation dictionary ───────────────────────────────────────────────────
export const translations: Record<string, Record<Lang, string>> = {
  // ── Navbar ──────────────────────────────────────────────────────────────────
  'nav.hub':          { en: 'THE HUB',     hi: 'केन्द्र' },
  'nav.gurukul':      { en: 'GURUKUL',     hi: 'गुरुकुल' },
  'nav.resources':    { en: 'RESOURCES',   hi: 'संसाधन' },
  'nav.newsroom':     { en: 'NEWSROOM',    hi: 'समाचार' },
  'nav.marketplace':  { en: 'MARKETPLACE', hi: 'बाज़ार' },
  'nav.donate':       { en: 'DONATE',      hi: 'दान करें' },
  'nav.signin':       { en: 'SIGN IN',     hi: 'प्रवेश' },
  'nav.signup':       { en: 'SIGN UP',     hi: 'पंजीकरण' },
  // Hub sub-items
  'nav.hub.about':       { en: 'About the Centre',     hi: 'केन्द्र के बारे में' },
  'nav.hub.vision':      { en: 'Mission & Vision',     hi: 'मिशन और दृष्टि' },
  'nav.hub.founders':    { en: 'Founders & Advisors',  hi: 'संस्थापक और सलाहकार' },
  'nav.hub.financial':   { en: 'Financial Reports',    hi: 'वित्तीय रिपोर्ट' },
  'nav.hub.collab':      { en: 'Collaborations',       hi: 'सहयोग' },
  'nav.hub.contact':     { en: 'Contact Us',           hi: 'संपर्क करें' },
  // Gurukul sub-items
  'nav.gurukul.foundation': { en: 'The Foundation',      hi: 'आधार' },
  'nav.gurukul.programs':   { en: 'Program Overview',    hi: 'कार्यक्रम सारांश' },
  'nav.gurukul.digital':    { en: 'Digital Gurukul',     hi: 'डिजिटल गुरुकुल' },
  'nav.gurukul.ayurveda':   { en: 'Āyurveda Research',   hi: 'आयुर्वेद अनुसंधान' },
  'nav.gurukul.join':       { en: 'Join Us Today',     hi: 'भाग लें' },
  'nav.gurukul.meta':       { en: 'Meta Gurukul',        hi: 'मेटा गुरुकुल' },
  // Resources sub-items
  'nav.res.apps':      { en: 'Digital Welfare Suite', hi: 'डिजिटल कल्याण ऐप्स' },
  'nav.res.volunteer': { en: 'Volunteer Program',     hi: 'स्वयंसेवक कार्यक्रम' },
  'nav.res.events':    { en: 'Events Calendar',       hi: 'कार्यक्रम कैलेंडर' },
  'nav.res.faqs':      { en: 'FAQs',                  hi: 'अक्सर पूछे जाने वाले प्रश्न' },
  // Newsroom sub-items
  'nav.news.blog':    { en: 'Official Blog',   hi: 'आधिकारिक ब्लॉग' },
  'nav.news.press':   { en: 'Media & Press',   hi: 'मीडिया और प्रेस' },
  'nav.news.impact':  { en: 'Impact Stories',  hi: 'प्रभाव की कहानियाँ' },

  // ── Homepage Hero ────────────────────────────────────────────────────────────
  'hero.badge':       { en: 'ANCIENT HUMAN SCIENCES. MODERN EXECUTION. PUBLIC BENEFIT.', hi: 'प्राचीन मानव विज्ञान। आधुनिक क्रियान्वयन। लोक कल्याण।' },
  'hero.title1':      { en: 'Sanatan',         hi: 'सनातन' },
  'hero.title2':      { en: 'International',   hi: 'इंटरनेशनल' },
  'hero.subtitle':    { en: 'Centre for Human Flourishing', hi: 'मानव समृद्धि का केन्द्र' },
  'hero.tagline':     { en: 'Ancient human sciences. Modern execution. Public benefit.', hi: 'प्राचीन मानव विज्ञान। आधुनिक क्रियान्वयन। लोक कल्याण।' },
  'hero.desc':        { en: 'We are building a permanent campus in El-Sabrante (33 acres) for Gurukul-based skill & consciousness education, Ayurveda research & preventive health education, ethical human-centric technology, and sustainable indigenous production.', hi: 'हम एल-सेब्रान्टे (33 एकड़) में एक स्थायी परिसर बना रहे हैं — गुरुकुल-आधारित कौशल और चेतना शिक्षा, आयुर्वेद अनुसंधान, नैतिक प्रौद्योगिकी और टिकाऊ स्वदेशी उत्पादन के लिए।' },
  'hero.goal':        { en: 'PRIMARY GOAL RIGHT NOW: LAND ACQUISITION.', hi: 'अभी का प्राथमिक लक्ष्य: भूमि अधिग्रहण।' },
  'hero.cta1':        { en: 'DONATE TO LAND FUND',  hi: 'भूमि कोष में दान करें' },
  'hero.cta2':        { en: 'EXPLORE PROGRAMS',     hi: 'कार्यक्रम देखें' },
  'hero.cta3':        { en: 'VIEW TRANSPARENCY',    hi: 'पारदर्शिता देखें' },

  // ── Homepage sections ────────────────────────────────────────────────────────
  'home.path.title':   { en: 'Choose Your Path', hi: 'अपना मार्ग चुनें' },
  'home.path.sub':     { en: 'Three pillars. One complete life.', hi: 'तीन स्तंभ। एक पूर्ण जीवन।' },
  'home.pillars.title': { en: 'Why These Three Pillars?', hi: 'ये तीन स्तंभ क्यों?' },
  'home.pillars.sub':   { en: 'The ancient Gurukul system understood that a complete human being must be healthy in body, wise in mind, and effective in the world.', hi: 'प्राचीन गुरुकुल प्रणाली समझती थी कि एक पूर्ण मनुष्य को शरीर से स्वस्थ, मन से विवेकशील और संसार में प्रभावशाली होना चाहिए।' },
  'home.land.title':   { en: 'Why Land First?', hi: 'पहले भूमि क्यों?' },
  'home.land.sub':     { en: 'A permanent, owned campus is the foundation of everything. Without roots, no tree can grow.', hi: 'एक स्थायी, स्वामित्व वाला परिसर हर चीज़ की नींव है। जड़ों के बिना कोई वृक्ष नहीं उगता।' },
  'home.progress.title': { en: 'Our Progress', hi: 'हमारी प्रगति' },
  'home.campus.title':  { en: 'El Sabrante Campus', hi: 'एल सेब्रान्टे परिसर' },
  'home.market.title':  { en: 'Sanatan Marketplace', hi: 'सनातन बाज़ार' },
  'home.market.sub':    { en: 'Ethically sourced Ayurvedic products. Every purchase funds the campus.', hi: 'नैतिक रूप से प्राप्त आयुर्वेदिक उत्पाद। प्रत्येक खरीद परिसर को वित्त पोषित करती है।' },
  'home.courses.title': { en: 'Gurukul Programs', hi: 'गुरुकुल कार्यक्रम' },
  'home.courses.sub':   { en: 'Ancient wisdom. Modern delivery. Open to all.', hi: 'प्राचीन ज्ञान। आधुनिक वितरण। सभी के लिए खुला।' },
  'home.community.title': { en: 'Community Circles', hi: 'समुदाय मंडल' },
  'home.newsletter.title': { en: 'Stay Connected', hi: 'जुड़े रहें' },
  'home.newsletter.sub':   { en: 'Receive weekly Vedic wisdom, campus updates, and program announcements.', hi: 'साप्ताहिक वैदिक ज्ञान, परिसर अपडेट और कार्यक्रम घोषणाएँ प्राप्त करें।' },
  'home.newsletter.placeholder': { en: 'your@email.com', hi: 'आपका@ईमेल.com' },
  'home.newsletter.btn': { en: 'Join the Community →', hi: 'समुदाय से जुड़ें →' },
  'home.cta.title':    { en: 'Join Us Today', hi: 'आज जुड़ें' },
  'home.cta.sub':      { en: 'Whether you donate, study, teach, or simply share — you are part of something ancient and urgent.', hi: 'चाहे आप दान करें, पढ़ें, पढ़ाएं, या बस साझा करें — आप कुछ प्राचीन और आवश्यक का हिस्सा हैं।' },
  'home.apply':        { en: 'Apply →', hi: 'आवेदन करें →' },
  'home.learnmore':    { en: 'Learn More →', hi: 'और जानें →' },
  'home.viewall':      { en: 'View All Programs →', hi: 'सभी कार्यक्रम देखें →' },
  'home.shop':         { en: 'Shop Now →', hi: 'अभी खरीदें →' },
  'home.addcart':      { en: 'Add to Cart', hi: 'कार्ट में जोड़ें' },

  // ── Shloka widget ────────────────────────────────────────────────────────────
  'shloka.title':   { en: 'Shloka of the Day', hi: 'आज का श्लोक' },
  'shloka.share':   { en: 'Share', hi: 'साझा करें' },
  'shloka.listen':  { en: 'Listen', hi: 'सुनें' },

  // ── Footer ───────────────────────────────────────────────────────────────────
  'footer.tagline':  { en: 'Ancient human sciences. Modern execution. Public benefit.', hi: 'प्राचीन मानव विज्ञान। आधुनिक क्रियान्वयन। लोक कल्याण।' },
  'footer.rights':   { en: 'All rights reserved.', hi: 'सर्वाधिकार सुरक्षित।' },
  'footer.nonprofit': { en: 'A registered non-profit organisation.', hi: 'एक पंजीकृत गैर-लाभकारी संस्था।' },

  // ── Gurukul Foundation ───────────────────────────────────────────────────────
  'gf.badge':    { en: 'Gurukul · The Foundation', hi: 'गुरुकुल · आधार' },
  'gf.title1':   { en: 'Ancient wisdom.', hi: 'प्राचीन ज्ञान।' },
  'gf.title2':   { en: 'Three pillars.', hi: 'तीन स्तंभ।' },
  'gf.title3':   { en: 'One complete life.', hi: 'एक पूर्ण जीवन।' },
  'gf.desc':     { en: 'The Gurukul is not a school. It is a complete system for human flourishing — rooted in 5,000 years of tested science, delivered through the most effective modern formats.', hi: 'गुरुकुल एक विद्यालय नहीं है। यह मानव समृद्धि की एक पूर्ण प्रणाली है — 5,000 वर्षों के परीक्षित विज्ञान में निहित, सबसे प्रभावी आधुनिक प्रारूपों के माध्यम से प्रदान की गई।' },
  'gf.pillar.health':  { en: 'Health', hi: 'स्वास्थ्य' },
  'gf.pillar.edu':     { en: 'Education', hi: 'शिक्षा' },
  'gf.pillar.tech':    { en: 'Technology', hi: 'प्रौद्योगिकी' },
  'gf.teachers.title': { en: 'Meet the Teachers', hi: 'शिक्षकों से मिलें' },
  'gf.teachers.sub':   { en: 'Credentialed scholars, not chatbots. Every teacher is a living practitioner of their discipline.', hi: 'प्रमाणित विद्वान, चैटबॉट नहीं। प्रत्येक शिक्षक अपने अनुशासन का जीवंत साधक है।' },
  'gf.apply':          { en: 'Apply to Study →', hi: 'अध्ययन के लिए आवेदन करें →' },

  // ── Gurukul Programs ─────────────────────────────────────────────────────────
  'gp.badge':    { en: 'Gurukul · Programs', hi: 'गुरुकुल · कार्यक्रम' },
  'gp.title':    { en: 'A curriculum built for the 21st century seeker.', hi: '21वीं सदी के साधक के लिए निर्मित पाठ्यक्रम।' },
  'gp.kids':     { en: 'For Children', hi: 'बच्चों के लिए' },
  'gp.adults':   { en: 'For Adults', hi: 'वयस्कों के लिए' },
  'gp.apply':    { en: 'Apply Now →', hi: 'अभी आवेदन करें →' },

  // ── Digital Gurukul ──────────────────────────────────────────────────────────
  'dg.badge':    { en: 'Digital Gurukul · App Coming Soon', hi: 'डिजिटल गुरुकुल · ऐप शीघ्र आ रहा है' },
  'dg.title1':   { en: 'Ancient wisdom.', hi: 'प्राचीन ज्ञान।' },
  'dg.title2':   { en: 'Daily. Live. Human.', hi: 'प्रतिदिन। सीधा। मानवीय।' },
  'dg.desc':     { en: 'Not a chatbot. Not pre-recorded content. A real Gurukul — with credentialed teachers, live Zoom classes, monthly cohorts for children, and a complete digital library of Vedic scriptures.', hi: 'न चैटबॉट। न पूर्व-रिकॉर्डेड सामग्री। एक वास्तविक गुरुकुल — प्रमाणित शिक्षकों के साथ, सीधी ज़ूम कक्षाएँ, बच्चों के लिए मासिक बैच, और वैदिक ग्रंथों की एक पूर्ण डिजिटल लाइब्रेरी।' },
  'dg.satsang.title': { en: 'Join the Free Weekly Satsang', hi: 'निःशुल्क साप्ताहिक सत्संग में शामिल हों' },
  'dg.satsang.sub':   { en: 'Every Sunday. Open to all. No enrollment required.', hi: 'प्रत्येक रविवार। सभी के लिए खुला। नामांकन की आवश्यकता नहीं।' },
  'dg.library.title': { en: 'Digital Library', hi: 'डिजिटल पुस्तकालय' },
  'dg.library.sub':   { en: 'Sacred texts. Accessible to all.', hi: 'पवित्र ग्रंथ। सभी के लिए सुलभ।' },
  'dg.cohort.join':   { en: 'Join Next Cohort →', hi: 'अगले बैच में शामिल हों →' },
  'dg.library.browse': { en: 'Browse Digital Library', hi: 'डिजिटल पुस्तकालय देखें' },

  // ── Ayurveda ─────────────────────────────────────────────────────────────────
  'ay.badge':    { en: 'Gurukul · Āyurveda Research', hi: 'गुरुकुल · आयुर्वेद अनुसंधान' },
  'ay.title1':   { en: 'Not alternative medicine.', hi: 'वैकल्पिक चिकित्सा नहीं।' },
  'ay.title2':   { en: 'Preventive civilisation.', hi: 'निवारक सभ्यता।' },
  'ay.desc':     { en: 'Āyurveda is a complete system of preventive health that has been tested across 5,000 years. We are building the research infrastructure to bring it into the 21st century — with rigour, not romanticism.', hi: 'आयुर्वेद 5,000 वर्षों में परीक्षित निवारक स्वास्थ्य की एक पूर्ण प्रणाली है। हम इसे 21वीं सदी में लाने के लिए अनुसंधान अवसंरचना बना रहे हैं — कठोरता के साथ, रोमांटिकता के साथ नहीं।' },
  'ay.research.title': { en: 'Our Research Areas', hi: 'हमारे अनुसंधान क्षेत्र' },
  'ay.join':     { en: 'Join the Research →', hi: 'अनुसंधान में शामिल हों →' },

  // ── Join / Join Us Today ───────────────────────────────────────────────────
  'join.badge':   { en: 'Gurukul · Join Us Today', hi: 'गुरुकुल · भाग लें' },
  'join.title':   { en: 'The Gurukul needs you.', hi: 'गुरुकुल को आपकी ज़रूरत है।' },
  'join.sub':     { en: 'Every role matters.', hi: 'हर भूमिका महत्वपूर्ण है।' },
  'join.desc':    { en: 'Whether you are a student seeking transformation, a parent wanting the best for your child, a teacher ready to share your knowledge, or a volunteer with skills to offer — there is a place for you here.', hi: 'चाहे आप परिवर्तन की तलाश में एक छात्र हों, अपने बच्चे के लिए सर्वश्रेष्ठ चाहने वाले माता-पिता हों, ज्ञान साझा करने के लिए तैयार शिक्षक हों, या कौशल प्रदान करने वाले स्वयंसेवक हों — यहाँ आपके लिए जगह है।' },
  'join.student': { en: 'Student', hi: 'छात्र' },
  'join.parent':  { en: 'Parent', hi: 'अभिभावक' },
  'join.teacher': { en: 'Teacher', hi: 'शिक्षक' },
  'join.volunteer': { en: 'Volunteer', hi: 'स्वयंसेवक' },
  'join.submit':  { en: 'Submit Application →', hi: 'आवेदन जमा करें →' },
  'join.activation': { en: 'Enrollment is open to all. Access activated within 48–72 hours after verification. Your data is never sold or shared.', hi: 'नामांकन सभी के लिए खुला है। सत्यापन के बाद 48–72 घंटों में पहुँच सक्रिय की जाती है। आपका डेटा कभी नहीं बेचा या साझा किया जाता।' },

  // ── Meta Gurukul ─────────────────────────────────────────────────────────────
  'mg.badge':    { en: 'Gurukul · App', hi: 'गुरुकुल · ऐप' },
  'mg.soon':     { en: 'Coming to iOS & Android', hi: 'iOS और Android पर आ रहा है' },
  'mg.title1':   { en: 'Meta', hi: 'मेटा' },
  'mg.title2':   { en: 'Gurukul', hi: 'गुरुकुल' },
  'mg.tagline':  { en: 'Ancient wisdom. Daily. Live. Human.', hi: 'प्राचीन ज्ञान। प्रतिदिन। सीधा। मानवीय।' },
  'mg.desc':     { en: 'Not a course platform. Not pre-recorded content. A real Gurukul — with credentialed teachers, live Zoom classes, monthly cohorts for children, and a complete digital library of Vedic scriptures.', hi: 'न कोर्स प्लेटफॉर्म। न पूर्व-रिकॉर्डेड सामग्री। एक वास्तविक गुरुकुल — प्रमाणित शिक्षकों के साथ, सीधी ज़ूम कक्षाएँ, बच्चों के लिए मासिक बैच, और वैदिक ग्रंथों की पूर्ण डिजिटल लाइब्रेरी।' },
  'mg.waitlist': { en: 'Join Waitlist →', hi: 'प्रतीक्षा सूची में शामिल हों →' },
  'mg.cohort':   { en: 'Join Next Cohort →', hi: 'अगले बैच में शामिल हों →' },

  // ── Hub pages ────────────────────────────────────────────────────────────────
  'hub.badge':      { en: 'The Hub', hi: 'केन्द्र' },
  'hub.about.title': { en: 'About the Centre', hi: 'केन्द्र के बारे में' },
  'hub.vision.title': { en: 'Mission & Vision', hi: 'मिशन और दृष्टि' },
  'hub.founders.title': { en: 'Founders & Advisors', hi: 'संस्थापक और सलाहकार' },

  // ── Donate ───────────────────────────────────────────────────────────────────
  'donate.title':  { en: 'Build the Campus.', hi: 'परिसर बनाएं।' },
  'donate.title2': { en: 'Preserve the Dharma.', hi: 'धर्म की रक्षा करें।' },
  'donate.sub':    { en: 'Every donation — large or small — brings us closer to the 33-acre El Sabrante campus that will serve humanity for generations.', hi: 'हर दान — बड़ा या छोटा — हमें 33 एकड़ के एल सेब्रान्टे परिसर के करीब लाता है जो पीढ़ियों तक मानवता की सेवा करेगा।' },
  'donate.btn':    { en: 'Complete Donation →', hi: 'दान पूर्ण करें →' },
  'donate.raised': { en: 'Raised', hi: 'जुटाया गया' },
  'donate.donors': { en: 'Donors', hi: 'दाताओं' },
  'donate.goal':   { en: 'Goal', hi: 'लक्ष्य' },

  // ── Contact ──────────────────────────────────────────────────────────────────
  'contact.title': { en: 'Get in Touch', hi: 'संपर्क करें' },
  'contact.sub':   { en: 'We read every message. Our team responds within 3–5 business days.', hi: 'हम हर संदेश पढ़ते हैं। हमारी टीम 3–5 कार्य दिवसों में जवाब देती है।' },
  'contact.send':  { en: 'Send Message →', hi: 'संदेश भेजें →' },

  // ── Blog ─────────────────────────────────────────────────────────────────────
  'blog.title':    { en: 'Official Blog', hi: 'आधिकारिक ब्लॉग' },
  'blog.sub':      { en: 'Insights on Vedic science, Āyurveda, Sanskrit, and the Gurukul mission.', hi: 'वैदिक विज्ञान, आयुर्वेद, संस्कृत और गुरुकुल मिशन पर विचार।' },
  'blog.readmore': { en: 'Read Article →', hi: 'लेख पढ़ें →' },
  'blog.loadmore': { en: 'Load More Articles', hi: 'और लेख लोड करें' },

  // ── Events ───────────────────────────────────────────────────────────────────
  'events.title':  { en: 'Events Calendar', hi: 'कार्यक्रम कैलेंडर' },
  'events.sub':    { en: 'Satsangs, workshops, and community gatherings — online and in-person.', hi: 'सत्संग, कार्यशालाएँ और सामुदायिक सभाएँ — ऑनलाइन और व्यक्तिगत।' },
  'events.register': { en: 'Register →', hi: 'पंजीकरण करें →' },

  // ── Volunteer ────────────────────────────────────────────────────────────────
  'vol.title':   { en: 'Volunteer Program', hi: 'स्वयंसेवक कार्यक्रम' },
  'vol.sub':     { en: 'Offer your skills. Serve the mission.', hi: 'अपने कौशल का योगदान दें। मिशन की सेवा करें।' },
  'vol.apply':   { en: 'Apply to Volunteer →', hi: 'स्वयंसेवक के रूप में आवेदन करें →' },

  // ── FAQs ─────────────────────────────────────────────────────────────────────
  'faq.title':   { en: 'Frequently Asked Questions', hi: 'अक्सर पूछे जाने वाले प्रश्न' },
  'faq.sub':     { en: 'Everything you need to know about enrollment, donations, and the Gurukul mission.', hi: 'नामांकन, दान और गुरुकुल मिशन के बारे में आपको जो कुछ जानना चाहिए।' },
  'faq.search':  { en: 'Search questions…', hi: 'प्रश्न खोजें…' },

  // ── Apps / Digital Welfare Suite ─────────────────────────────────────────────
  'apps.title':  { en: 'Digital Welfare Suite', hi: 'डिजिटल कल्याण सूट' },
  'apps.sub':    { en: 'Technology that serves humanity, not harvests it.', hi: 'प्रौद्योगिकी जो मानवता की सेवा करती है, उसका शोषण नहीं।' },

  // ── Common ───────────────────────────────────────────────────────────────────
  'common.comingsoon': { en: 'Coming Soon', hi: 'शीघ्र आ रहा है' },
  'common.learnmore':  { en: 'Learn More →', hi: 'और जानें →' },
  'common.apply':      { en: 'Apply →', hi: 'आवेदन करें →' },
  'common.donate':     { en: 'Donate →', hi: 'दान करें →' },
  'common.share':      { en: 'Share', hi: 'साझा करें' },
  'common.preview':    { en: 'Preview Excerpt →', hi: 'अंश देखें →' },
  'common.download':   { en: 'Download PDF', hi: 'PDF डाउनलोड करें' },
  'common.close':      { en: 'Close', hi: 'बंद करें' },
  'common.email.placeholder': { en: 'your@email.com', hi: 'आपका@ईमेल.com' },
  'common.name.placeholder':  { en: 'Your full name', hi: 'आपका पूरा नाम' },
  'common.submit':     { en: 'Submit', hi: 'जमा करें' },
  'common.loading':    { en: 'Loading…', hi: 'लोड हो रहा है…' },
  'common.success':    { en: 'Thank you!', hi: 'धन्यवाद!' },
  'common.error':      { en: 'Something went wrong. Please try again.', hi: 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।' },
  'common.openaccess': { en: 'Open Access', hi: 'खुली पहुँच' },
  'common.free':       { en: 'Free', hi: 'निःशुल्क' },
  'common.live':       { en: 'Live', hi: 'लाइव' },
  'common.new':        { en: 'New', hi: 'नया' },
  'common.bestseller': { en: 'Best Seller', hi: 'सर्वाधिक बिकने वाला' },
  'common.toprated':   { en: 'Top Rated', hi: 'शीर्ष रेटेड' },
  'common.premium':    { en: 'Premium', hi: 'प्रीमियम' },
  'common.students':   { en: 'students', hi: 'छात्र' },
  'common.weeks':      { en: 'weeks', hi: 'सप्ताह' },
  'common.days':       { en: 'days', hi: 'दिन' },
  'common.hours':      { en: 'hrs', hi: 'घंटे' },
  'common.mins':       { en: 'min', hi: 'मिनट' },
  'common.secs':       { en: 'sec', hi: 'सेकंड' },
  'common.nextcohort': { en: 'NEXT COHORT', hi: 'अगला बैच' },
  'common.addcalendar': { en: 'Add to Calendar', hi: 'कैलेंडर में जोड़ें' },
  'common.readmore':   { en: 'Read More', hi: 'और पढ़ें' },
  'common.viewall':    { en: 'View All →', hi: 'सभी देखें →' },
  'common.backto':     { en: 'Back to', hi: 'वापस जाएँ' },
  'common.allrights':  { en: 'All rights reserved', hi: 'सर्वाधिकार सुरक्षित' },
  'common.nonprofit':  { en: 'A registered non-profit organisation', hi: 'एक पंजीकृत गैर-लाभकारी संस्था' },
  'common.lang.en':    { en: 'EN', hi: 'EN' },
  'common.lang.hi':    { en: 'HI', hi: 'HI' },
  // ── Join page form labels ────────────────────────────────────────────────────
  'join.form.fullname':     { en: 'Full Name', hi: 'पूरा नाम' },
  'join.form.email':        { en: 'Email Address', hi: 'ईमेल पता' },
  'join.form.phone':        { en: 'Phone Number', hi: 'फ़ोन नंबर' },
  'join.form.country':      { en: 'Country', hi: 'देश' },
  'join.form.age':          { en: 'Age', hi: 'आयु' },
  'join.form.message':      { en: 'Tell us about yourself', hi: 'अपने बारे में बताएं' },
  'join.form.stream':       { en: 'Preferred Stream', hi: 'पसंदीदा धारा' },
  'join.form.experience':   { en: 'Teaching Experience', hi: 'शिक्षण अनुभव' },
  'join.form.subject':      { en: 'Subject / Specialisation', hi: 'विषय / विशेषज्ञता' },
  'join.form.availability': { en: 'Availability', hi: 'उपलब्धता' },
  'join.form.skills':       { en: 'Skills to Offer', hi: 'प्रदान करने योग्य कौशल' },
  'join.form.childname':    { en: "Child's Name", hi: 'बच्चे का नाम' },
  'join.form.childage':     { en: "Child's Age", hi: 'बच्चे की आयु' },
  'join.form.goals':        { en: 'Learning Goals', hi: 'सीखने के लक्ष्य' },
  'join.form.docs':         { en: 'Supporting Documents (optional)', hi: 'सहायक दस्तावेज़ (वैकल्पिक)' },
  'join.form.donate.label': { en: 'Voluntary Donation to Campus Fund', hi: 'परिसर कोष में स्वैच्छिक दान' },
  'join.form.donate.note':  { en: 'Any amount is welcome. Enrollment is not conditional on donation.', hi: 'कोई भी राशि स्वागत योग्य है। नामांकन दान पर निर्भर नहीं है।' },
  'join.form.submit':       { en: 'Submit Application →', hi: 'आवेदन जमा करें →' },
  'join.form.submitting':   { en: 'Submitting…', hi: 'जमा हो रहा है…' },
  'join.form.success.title': { en: 'Application Received!', hi: 'आवेदन प्राप्त हुआ!' },
  'join.form.success.sub':  { en: 'We will review your application and contact you within 48–72 hours.', hi: 'हम आपके आवेदन की समीक्षा करेंगे और 48–72 घंटों में आपसे संपर्क करेंगे।' },
  'join.form.select':       { en: 'Select…', hi: 'चुनें…' },
  'join.form.optional':     { en: 'optional', hi: 'वैकल्पिक' },
  // Streams
  'join.stream.sanskrit':   { en: 'Sanskrit', hi: 'संस्कृत' },
  'join.stream.yoga':       { en: 'Yoga & Meditation', hi: 'योग और ध्यान' },
  'join.stream.vedic':      { en: 'Vedic Science', hi: 'वैदिक विज्ञान' },
  'join.stream.ayurveda':   { en: 'Āyurveda', hi: 'आयुर्वेद' },
  'join.stream.all':        { en: 'All Streams', hi: 'सभी धाराएँ' },
  // Role labels
  'join.role.student.title':   { en: 'Student Enrollment Application', hi: 'छात्र नामांकन आवेदन' },
  'join.role.parent.title':    { en: 'Parent Enrollment Application', hi: 'अभिभावक नामांकन आवेदन' },
  'join.role.teacher.title':   { en: 'Teacher Application', hi: 'शिक्षक आवेदन' },
  'join.role.volunteer.title': { en: 'Volunteer Application', hi: 'स्वयंसेवक आवेदन' },

};

// ─── Provider ─────────────────────────────────────────────────────────────────
const SOUTH_ASIA_COUNTRIES = ['IN', 'PK', 'NP', 'AF', 'LK'];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    // Check localStorage override first
    const stored = localStorage.getItem('si_lang') as Lang | null;
    if (stored === 'en' || stored === 'hi') {
      setLangState(stored);
      setDetected(true);
      return;
    }
    // English is the default. Only switch to Hindi if the user's device/browser
    // is explicitly configured in Hindi, Nepali, or Urdu.
    // IP geo-detection is intentionally removed: sandbox and CDN IPs are often
    // routed through South Asia, causing English-speaking users to see Hindi.
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('hi') || browserLang.startsWith('ne') || browserLang.startsWith('ur')) {
      setLangState('hi');
    } else {
      setLangState('en');
    }
    setDetected(true);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('si_lang', l);
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
