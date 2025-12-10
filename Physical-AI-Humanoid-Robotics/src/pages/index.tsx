import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/module-1-ros-foundations/week-1">
            Start Reading - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

function ModuleHighlights() {
  const modules = [
    {
      title: 'Module 1: ROS 2 & Robotics Foundations',
      link: '/docs/module-1-ros-foundations/week-1',
      description: (
        <>
          Start your journey into the world of robotics with ROS 2, the standard framework for robot software development.
        </>
      ),
    },
    {
      title: 'Module 2: Gazebo & Unity Digital Twin Simulation',
      link: '/docs/module-2-simulation/week-4',
      description: (
        <>
          Learn how to build, test, and simulate your robots in realistic virtual environments before deploying to hardware.
        </>
      ),
    },
    {
      title: 'Module 3: NVIDIA Isaac & Advanced Perception',
      link: '/docs/module-3-nvidia-isaac/week-7',
      description: (
        <>
          Dive into advanced, GPU-accelerated simulation and synthetic data generation for training powerful AI models.
        </>
      ),
    },
    {
        title: 'Module 4: Vision-Language-Action (VLA) Pipelines',
        link: '/docs/module-4-vla-pipelines/week-10',
        description: (
          <>
            Explore the cutting-edge of AI in robotics by building systems that understand natural language commands.
          </>
        ),
      },
  ];

  return (
    <section className={styles.modulesSection}>
      <div className="container">
        <div className="row">
          {modules.map((props, idx) => (
            <div key={idx} className={clsx('col col--6', styles.moduleCard)}>
                <div className="card">
                    <div className="card__header">
                        <h3>{props.title}</h3>
                    </div>
                    <div className="card__body">
                        <p>{props.description}</p>
                    </div>
                    <div className="card__footer">
                        <Link
                        className="button button--primary button--block"
                        to={props.link}>
                        Explore Module
                        </Link>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="An exploration of modern robotics with Spec-Driven Development.">
      <HomepageHeader />
      <main>
        <ModuleHighlights />
      </main>
    </Layout>
  );
}
