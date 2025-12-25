import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import ChatbotWidget from '../components/Chatbot/ChatbotWidget'; // Import the chatbot widget

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroInner}>
          <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
            {siteConfig.title}
          </Heading>
          <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
            {siteConfig.tagline}
          </p>
          <div className={styles.indexCtas}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/module-1-ros-foundations/week-1">
              Start Learning
            </Link>
            <span className={styles.indexCtasGitHubButtonWrapper}>
              <Link
                className="button button--primary button--outline button--lg"
                href="https://github.com/Rofan-Jlove/hackathon-1-new">
                GitHub
              </Link>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function ModuleCard({ title, description, to, color }) {
  return (
    <div className={clsx('col col--3', styles.moduleCard)}>
      <div className={styles.moduleCardInner} style={{ borderLeft: `5px solid ${color}` }}>
        <div className={styles.moduleCardHeader}>
          <Heading as="h3" className={styles.moduleCardTitle}>
            {title}
          </Heading>
        </div>
        <div className={styles.moduleCardBody}>
          <p>{description}</p>
        </div>
        <div className={styles.moduleCardFooter}>
          <Link to={to} className="button button--primary button--block">
            Explore Module
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home(): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();

  return (
    <div className={styles.landingPageContainer}>
      <Layout
        title={`Home - ${siteConfig.title}`}
        description="Physical AI & Humanoid Robotics: An exploration of modern robotics with Spec-Driven Development">
        <HomepageHeader />
        <main className={styles.mainContent}>
          <section className={styles.modulesSection}>
            <div className="container">
              <div className="row">
                <ModuleCard
                  title="Module 1: ROS 2 Foundations"
                  description="Learn robotics with ROS 2 framework."
                  to="/docs/module-1-ros-foundations/week-1"
                  color="#1c6bb0"
                />
                <ModuleCard
                  title="Module 2: Simulation Environments"
                  description="Simulate robots in virtual worlds."
                  to="/docs/module-2-simulation/week-4"
                  color="#4a90e2"
                />
                <ModuleCard
                  title="Module 3: Advanced Perception"
                  description="NVIDIA tools for robot perception."
                  to="/docs/module-3-nvidia-isaac/week-7"
                  color="#00a6ed"
                />
                <ModuleCard
                  title="Module 4: AI Robotics Pipelines"
                  description="Vision-Language-Action systems."
                  to="/docs/module-4-vla-pipelines/week-10"
                  color="#0077cc"
                />
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </div>
  );
}
