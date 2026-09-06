import { ARROW_ICON, CAP_ICON, iconSvg, TRENDING_ICON, USERS_ICON } from './chrome.js'

const DOWN_ICON = `
  <svg class="btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
`

const CHECK_ICON = iconSvg(
  'frame-check-icon',
  `<circle cx="12" cy="12" r="10" />
   <path d="m8 12 2.8 2.8L16.5 9" />`
)

function frameIcon(paths) {
  return iconSvg('frame-icon', paths)
}

const CODE_ICON = frameIcon(
  `<polyline points="16 18 22 12 16 6" />
   <polyline points="8 6 2 12 8 18" />`
)

const GEAR_ICON = frameIcon(
  `<circle cx="12" cy="12" r="3" />
   <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H8a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V8c.3.6.9 1 1.5 1.1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />`
)

const BULB_ICON = frameIcon(
  `<path d="M9 18h6" />
   <path d="M10 22h4" />
   <path d="M12 2a7 7 0 0 0-4 12c.6.6 1 1.5 1 2.4V18h6v-1.6c0-.9.4-1.8 1-2.4A7 7 0 0 0 12 2z" />`
)

const ROBOT_ICON = frameIcon(
  `<rect x="5" y="9" width="14" height="10" rx="2" />
   <path d="M12 3v4" />
   <circle cx="9" cy="14" r="1" />
   <circle cx="15" cy="14" r="1" />
   <path d="M8 9V7h8v2" />`
)

const CUBE_ICON = frameIcon(
  `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
   <path d="M3.3 7 12 12l8.7-5" />
   <path d="M12 22V12" />`
)

const CIRCUIT_ICON = frameIcon(
  `<rect x="4" y="4" width="16" height="16" rx="2" />
   <path d="M9 9h6v6H9z" />
   <path d="M9 4v3M15 4v3M9 17v3M15 17v3M4 9h3M4 15h3M17 9h3M17 15h3" />`
)

const MONITOR_ICON = frameIcon(
  `<rect x="2" y="3" width="20" height="14" rx="2" />
   <path d="M8 21h8" />
   <path d="M12 17v4" />`
)

const PEOPLE_ICON = frameIcon(
  `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
   <circle cx="9" cy="7" r="4" />
   <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
   <path d="M16 3.13a4 4 0 0 1 0 7.75" />`
)

const CHART_ICON = frameIcon(
  `<path d="M4 19V5" />
   <path d="M4 19h16" />
   <path d="M8 16v-5" />
   <path d="M12 16V8" />
   <path d="M16 16v-3" />`
)

const TECHS = [
  ['Python', 'Py'],
  ['Java', 'Jv'],
  ['JavaScript', 'JS'],
  ['React', 'Re'],
  ['C++', 'C+'],
  ['Web Development', 'Web'],
  ['Arduino', 'Ar'],
  ['Raspberry Pi', 'Pi'],
  ['Game Development', 'Game'],
  ['3D Printing & CAD', '3D'],
]

export function programmingStemHtml() {
  return `
    <section class="frame-hero" aria-label="Programming &amp; STEM">
      <div class="frame-hero-media" aria-hidden="true">
        <img src="/frames/stem-hero.jpg" alt="" />
      </div>
      <div class="frame-hero-shade" aria-hidden="true"></div>
      <div class="frame-wrap frame-hero-copy">
        <p class="frame-kicker">Programming &amp; STEM tutoring</p>
        <h1>Build real skills for the <em>real world.</em></h1>
        <p class="frame-lead">
          Hands-on programming and STEM tutoring — projects a student can
          point to, not a playlist of videos. Problem-solving, creativity,
          and a mentor who stays with the work.
        </p>
        <div class="frame-actions">
          <a class="primary-button" href="/consult">
            Book a Free Consultation
            ${ARROW_ICON}
          </a>
          <a class="frame-ghost" href="#tracks">
            Explore Programs
            ${DOWN_ICON}
          </a>
        </div>
      </div>
      <div class="frame-feature-bar">
        <div class="frame-wrap frame-feature-grid">
          <article>
            ${CODE_ICON}
            <div>
              <strong>Hands-on projects</strong>
              <span>Learn by building</span>
            </div>
          </article>
          <article>
            ${GEAR_ICON}
            <div>
              <strong>Real technologies</strong>
              <span>Tools used in industry</span>
            </div>
          </article>
          <article>
            ${BULB_ICON}
            <div>
              <strong>Problem-solving skills</strong>
              <span>Build confidence</span>
            </div>
          </article>
          <article>
            ${PEOPLE_ICON}
            <div>
              <strong>Guidance at every level</strong>
              <span>From beginner to advanced</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="frame-band frame-band--paper" id="learn">
      <div class="frame-wrap">
        <div class="frame-split-head">
          <div>
            <p class="frame-kicker frame-kicker--ink">What students learn</p>
            <h2>From curiosity to creation.</h2>
          </div>
          <p class="frame-intro">
            Code, robotics, design, and electronics as real work. One dedicated
            mentor. Notes after every session.
          </p>
        </div>
        <div class="frame-learn-grid">
          <article>
            ${CODE_ICON}
            <h3>Programming</h3>
            <p>Python, Java, JavaScript, and web projects a student can ship.</p>
          </article>
          <article>
            ${ROBOT_ICON}
            <h3>Robotics</h3>
            <p>Arduino, Raspberry Pi, VEX, and machines that actually move.</p>
          </article>
          <article>
            ${CUBE_ICON}
            <h3>3D Printing &amp; Design</h3>
            <p>CAD, print, iterate — from a sketch to something they can hold.</p>
          </article>
          <article>
            ${CIRCUIT_ICON}
            <h3>Electronics &amp; Maker Projects</h3>
            <p>Sensors, circuits, and builds that teach how hardware thinks.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="frame-band frame-band--paper frame-band--tight" id="projects">
      <div class="frame-wrap">
        <div class="frame-projects">
          <div class="frame-projects-copy">
            <h2>Students don’t just learn concepts. They build.</h2>
            <p>
              Sketch stills of student work — placeholder until approved.
              The point is a project they can point to.
            </p>
            <a class="frame-text-link" href="/consult">
              See More Student Projects
              ${ARROW_ICON}
            </a>
          </div>
          <div class="frame-project-cards">
            <article>
              <img src="/frames/project-robot.jpg" alt="Small wheeled autonomous robot on a workbench" />
              <div>
                <h3>Autonomous Robot</h3>
                <p>Python + Arduino</p>
              </div>
            </article>
            <article>
              <img src="/frames/project-finance.jpg" alt="Laptop showing a personal finance dashboard" />
              <div>
                <h3>Personal Finance App</h3>
                <p>React + Python</p>
              </div>
            </article>
            <article>
              <img src="/frames/project-minecraft.jpg" alt="Block-built castle from a student game mod" />
              <div>
                <h3>Minecraft Mod</h3>
                <p>Java</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="frame-band frame-band--paper" id="tech">
      <div class="frame-wrap">
        <div class="frame-split-head">
          <h2>Real tools. Real opportunities.</h2>
          <a class="frame-text-link" href="#tracks">
            View All Topics
            ${ARROW_ICON}
          </a>
        </div>
        <ul class="frame-tech-row">
          ${TECHS.map(
            ([name, mark]) => `
              <li>
                <span class="frame-tech-mark">${mark}</span>
                <span>${name}</span>
              </li>
            `
          ).join('')}
        </ul>
      </div>
    </section>

    <section class="frame-band frame-band--mist" id="tracks">
      <div class="frame-wrap">
        <p class="frame-kicker frame-kicker--ink">Program tracks</p>
        <h2>Find the right fit for the work ahead.</h2>
        <div class="frame-track-grid">
          <article>
            ${MONITOR_ICON}
            <p class="frame-track-grade">Grades 3–6</p>
            <h3>Coding Foundations</h3>
            <p>Scratch, Minecraft, and first Python — build the habit of making.</p>
          </article>
          <article>
            ${CODE_ICON}
            <p class="frame-track-grade">Grades 6–10</p>
            <h3>Intermediate Programming</h3>
            <p>Python, Java, and web projects with a mentor who stays.</p>
          </article>
          <article>
            ${ROBOT_ICON}
            <p class="frame-track-grade">Grades 6–12</p>
            <h3>Robotics &amp; Hardware</h3>
            <p>Arduino, Raspberry Pi, and VEX/LEGO builds that move.</p>
          </article>
          <article>
            ${CHART_ICON}
            <p class="frame-track-grade">Grades 9–12</p>
            <h3>Advanced &amp; Competitive</h3>
            <p>CS coursework, internships, and a portfolio they can show.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="frame-cta" id="start">
      <div class="frame-cta-media" aria-hidden="true">
        <img src="/frames/stem-cta.jpg" alt="" />
      </div>
      <div class="frame-cta-shade" aria-hidden="true"></div>
      <div class="frame-wrap frame-cta-grid">
        <div>
          <p class="frame-kicker">Skills today. More options tomorrow.</p>
          <h2>Start building your future.</h2>
          <p>
            Book a free consult. We’ll match a mentor to the work — coding,
            robotics, or the next hard class.
          </p>
          <div class="frame-actions">
            <a class="primary-button" href="/consult">
              Book a Free Consultation
              ${ARROW_ICON}
            </a>
            <a class="frame-ghost" href="/pricing">View Pricing${ARROW_ICON}</a>
          </div>
        </div>
        <ul class="frame-check-list">
          <li>${CHECK_ICON}<span>Personalized learning path</span></li>
          <li>${CHECK_ICON}<span>Flexible scheduling (online or in-person)</span></li>
          <li>${CHECK_ICON}<span>Supportive, experienced tutors</span></li>
          <li>${CHECK_ICON}<span>Projects that build real skills</span></li>
        </ul>
        <aside class="frame-stack" aria-hidden="true">
          <span>Build</span>
          <span>Experiment</span>
          <span>Learn</span>
          <span>Repeat</span>
        </aside>
      </div>
    </section>
  `
}

export function aboutPageHtml() {
  return `
    <section class="frame-hero frame-hero--about" aria-label="About MetaMinds">
      <div class="frame-hero-media" aria-hidden="true">
        <img src="/frames/about-founders.jpg" alt="" />
      </div>
      <div class="frame-hero-shade" aria-hidden="true"></div>
      <div class="frame-wrap frame-hero-copy">
        <p class="frame-kicker">About MetaMinds</p>
        <h1>Students today.<br />Skills that last.</h1>
        <p class="frame-lead">
          MetaMinds STEM Academy was founded to give students the skills,
          confidence, and opportunities they need — in school and beyond.
          Dallas–Fort Worth. Zoom. The right mentor doesn’t have to live
          down the street.
        </p>
        <div class="frame-actions">
          <a class="primary-button" href="#story">
            Our Story
            ${ARROW_ICON}
          </a>
        </div>
      </div>
      <div class="frame-founder-bar">
        <div class="frame-wrap frame-founder-grid">
          <article>
            <strong>Jose Falconi-Cavallini</strong>
            <span>Co-Founder · UC San Diego, B.S. Computer Science</span>
          </article>
          <article>
            <strong>Emma Brugman</strong>
            <span>Co-Founder · UC San Diego B.S. Neuroscience · UC Berkeley M.S. Molecular Science and Software Engineering</span>
          </article>
        </div>
      </div>
    </section>

    <section class="frame-band frame-band--paper" id="mission">
      <div class="frame-wrap frame-mission">
        <div>
          <p class="frame-kicker frame-kicker--ink">Our mission</p>
          <h2>Make high-quality education more accessible.</h2>
          <p>
            Tutoring was leaving parents in the dark. The hour ended, and so
            did the trail. We believe every student deserves personalized
            guidance, engaging work, and a mentor who stays — notes after
            every session, written by the tutor who taught.
          </p>
          <p>
            MetaMinds started in Dallas–Fort Worth around that bet. AI can
            help a mentor prepare. It never takes the chair.
          </p>
        </div>
        <div class="frame-mission-grid">
          <article>
            ${CAP_ICON.replace('page2-stat-icon', 'frame-icon')}
            <h3>Students first</h3>
            <p>We put growth and well-being at the center — not a rotating cast.</p>
          </article>
          <article>
            ${USERS_ICON.replace('hero-trust-icon', 'frame-icon')}
            <h3>Personalized support</h3>
            <p>Every student learns differently. We meet them where they are.</p>
          </article>
          <article>
            ${TRENDING_ICON.replace('page2-stat-icon', 'frame-icon')}
            <h3>Real progress</h3>
            <p>Measurable growth in skills, confidence, and the next step.</p>
          </article>
          <article>
            ${BULB_ICON}
            <h3>Skills that last</h3>
            <p>We go beyond the next test to build work they can keep using.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="frame-stats" aria-label="Sketch stats">
      <div class="frame-wrap">
        <p class="example-tag">Jose unlock · placeholder stats</p>
        <div class="frame-stats-grid">
          <article>
            <strong>1000+</strong>
            <span>tutoring hours delivered</span>
          </article>
          <article>
            <strong>150+</strong>
            <span>students supported</span>
          </article>
          <article>
            <strong>4.9/5</strong>
            <span>average parent rating</span>
          </article>
          <article>
            <strong>DFW &amp; Online</strong>
            <span>families across Texas and beyond</span>
          </article>
        </div>
      </div>
    </section>

    <section class="frame-band frame-band--paper" id="story">
      <div class="frame-wrap frame-story">
        <div>
          <p class="frame-kicker frame-kicker--ink">Our story</p>
          <h2>From tutoring to a growing community.</h2>
          <p>
            MetaMinds started as one-on-one tutoring: one dedicated mentor,
            a plan you can actually see, and notes after every session.
          </p>
          <p>
            It grew into a STEM academy because families needed more than
            an hour that vanished. We built for parents who want proof of
            work — not vibes after a Zoom.
          </p>
          <a class="frame-text-link" href="#founders">
            Meet the Team
            ${ARROW_ICON}
          </a>
        </div>
        <figure class="frame-geisel">
          <img src="/frames/about-geisel.jpg" alt="UC San Diego Geisel Library at dusk" />
          <blockquote>
            <p>
              “We started MetaMinds because we know what’s possible when
              students are given the right support. It’s an honor to be
              part of their journey.”
            </p>
            <cite>Jose &amp; Emma, Co-Founders, MetaMinds STEM Academy</cite>
          </blockquote>
        </figure>
      </div>
    </section>

    <section class="frame-band frame-band--mist" id="founders">
      <div class="frame-wrap">
        <p class="frame-kicker frame-kicker--ink">The people building it</p>
        <h2>Founders and mentors. Same standard: stay with the student.</h2>
        <div class="frame-team-grid">
          <article>
            <h3>Jose Falconi-Cavallini</h3>
            <p>CEO &amp; Co-Founder. CS and SAT/ACT.</p>
          </article>
          <article>
            <h3>Emma Brugman</h3>
            <p>Co-Founder. ML, data, and SAT/ACT.</p>
          </article>
          <article>
            <h3>Johan Falconi-Cavallini</h3>
            <p>Co-Founder. Engineering and math.</p>
          </article>
          <article>
            <h3>Roberto Medina</h3>
            <p>R&amp;D design engineer. STEM.</p>
          </article>
          <article>
            <h3>Alan Martinez</h3>
            <p>Hardware validation engineer. STEM.</p>
          </article>
          <article>
            <h3>Christian Tapia</h3>
            <p>Math and CS. MBA candidate.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="frame-cta frame-cta--about" id="next">
      <div class="frame-cta-media" aria-hidden="true">
        <img src="/frames/about-cta.jpg" alt="" />
      </div>
      <div class="frame-cta-shade" aria-hidden="true"></div>
      <div class="frame-wrap frame-cta-grid frame-cta-grid--about">
        <div>
          <p class="frame-kicker">The mentor who stays</p>
          <h2>Let’s build what’s next.</h2>
          <p>
            Book a free consultation and learn how MetaMinds can support
            your student’s goals.
          </p>
          <a class="primary-button" href="/consult">
            Book a Free Consultation
            ${ARROW_ICON}
          </a>
        </div>
        <ul class="frame-cta-points">
          <li>${CAP_ICON.replace('page2-stat-icon', 'frame-icon')}<span>Stronger students</span></li>
          <li>${PEOPLE_ICON}<span>Greater opportunities</span></li>
          <li>${CHART_ICON}<span>Skills that last</span></li>
        </ul>
      </div>
    </section>
  `
}
