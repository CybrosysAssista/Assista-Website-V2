"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function page() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const sections = [
      "overview",
      "purpose",
      "multi-process",
      "process-responsibilities",
      "core-workbench",
      "workbench-parts",
      "extension-system",
      "extension-api",
      "type-converters",
      "dependency-injection",
      "core-services",
      "editor-monaco",
      "editor-config",
      "build-system",
      "build-artifacts",
      "initialization",
      "service-registration",
      "platform-support",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-100px 0px -50% 0px",
      }
    );

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  return (
    <div>
      <Header />

      <div className="cmpad mt-21">
        <div className="wiki-container">
          <div className="wiki-layout">
            {/* Left Sidebar - Navigation */}
            <aside className="wiki-sidebar-left custscrollA">
              <div className="sidebar-header">
                <p className="last-indexed flex items-center gap-2">
                  microsoft/vscode
                  <a href="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 0 0-7.071-7.071L9.878 7.05L8.464 5.636l1.414-1.414a7 7 0 0 1 9.9 9.9zm-2.829 2.828l-1.414 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 0 0 7.07 7.071l1.415-1.414zm-.707-10.607l1.415 1.415l-7.072 7.07l-1.414-1.414z"
                      />
                    </svg>
                  </a>
                </p>
              </div>
              <nav className="sidebar-nav">
                <ul className="nav-list">
                  <li className="nav-item">
                    <a href="#" className="nav-link nav-link-main">
                      Extension System
                    </a>
                    <ul className="nav-sublist">
                      <li>
                        <a href="#" className="nav-link">
                          Extension Host and API
                        </a>
                      </li>
                      <li>
                        <a href="#" className="nav-link">
                          Extension Management and Marketplace
                        </a>
                      </li>
                      <li>
                        <a href="#" className="nav-link">
                          Built-in Extensions
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <a href="#" className="nav-link nav-link-main">
                      Workbench and UI Framework
                    </a>
                    <ul className="nav-sublist">
                      <li>
                        <a href="#" className="nav-link">
                          Layout System and Editor Management
                        </a>
                      </li>
                      <li>
                        <a href="#" className="nav-link">
                          Actions, Menus, and Context Keys
                        </a>
                      </li>
                      <li>
                        <a href="#" className="nav-link">
                          Tree and List Components
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <a href="#" className="nav-link nav-link-main">
                      Chat and AI Integration
                    </a>
                    <ul className="nav-sublist">
                      <li>
                        <a href="#" className="nav-link">
                          Chat Widget and Session Management
                        </a>
                      </li>
                      <li>
                        <a href="#" className="nav-link">
                          AI Agents and Language Model Integration
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <a href="#" className="nav-link nav-link-main">
                      Source Control and Git Integration
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#" className="nav-link nav-link-main">
                      Core Platform Services
                    </a>
                    <ul className="nav-sublist">
                      <li>
                        <a href="#" className="nav-link">
                          File System and Storage Services
                        </a>
                      </li>
                      <li>
                        <a href="#" className="nav-link">
                          Configuration and Settings System
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <a href="#" className="nav-link nav-link-main">
                      Native Module Compilation and Platform Support
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#" className="nav-link nav-link-main">
                      Monaco Editor Integration
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#" className="nav-link nav-link-main">
                      Integrated Terminal System
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#" className="nav-link nav-link-main">
                      Notebook Editor System
                    </a>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* Main Content Area */}
            <main className="wiki-main-content custscrollA">
              <div className="content-header" id="overview">
                <h1 className="main-title">VS Code Architecture Overview</h1>
                {/* <div className="expandable-section">
                  <button className="expandable-toggle">
                    <span className="chevron">&gt;</span> Relevant source files
                  </button>
                </div> */}
              </div>

              <section className="content-section" id="purpose">
                <h2 className="section-title">Purpose and Scope</h2>
                <p className="section-text">
                  This document provides a high-level overview of VS Code's
                  architecture, focusing on the multi-process design, core
                  systems, and how major components interact. It explains the
                  separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase.
                </p>
                <p className="section-text">
                  This document provides a high-level overview of VS Code's
                  architecture, focusing on the multi-process design, core
                  systems, and how major components interact. It explains the
                  separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase.
                </p>
                <p className="section-text">
                  This document provides a high-level overview of VS Code's
                  architecture, focusing on the multi-process design, core
                  systems, and how major components interact. It explains the
                  separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase.
                </p>

                <div className="subsection">
                  <p className="subsection-text">
                    For detailed information about specific subsystems:
                  </p>
                  <ul className="subsection-list">
                    <li>
                      <span className="list-text">
                        Application startup and initialization:{" "}
                      </span>
                      <a href="#" className="inline-link">
                        see Application Startup and Process Architecture
                      </a>
                    </li>
                    <li>
                      <span className="list-text">Build system details: </span>
                      <a href="#" className="inline-link">
                        see Build System and Package Management
                      </a>
                    </li>
                    <li>
                      <span className="list-text">
                        Native module compilation:{" "}
                      </span>
                      <a href="#" className="inline-link">
                        see Native Module Compilation and Platform Support
                      </a>
                    </li>
                    <li>
                      <span className="list-text">
                        Extension architecture:{" "}
                      </span>
                      <a href="#" className="inline-link">
                        see Extension System
                      </a>
                    </li>
                    <li>
                      <span className="list-text">
                        Workbench UI framework:{" "}
                      </span>
                      <a href="#" className="inline-link">
                        see Workbench and UI Framework
                      </a>
                    </li>
                    <li>
                      <span className="list-text">
                        Monaco editor integration:{" "}
                      </span>
                      <a href="#" className="inline-link">
                        see Monaco Editor Integration
                      </a>
                    </li>
                  </ul>
                </div>
              </section>

              <section className="content-section" id="multi-process">
                <h2 className="section-title">Multi-Process Architecture</h2>
                <p className="section-text">
                  VS Code runs as a multi-process Electron application with
                  clear separation of concerns for security, stability, and
                  extensibility. This document provides a high-level overview of
                  VS Code's architecture, focusing on the multi-process design,
                  core systems, and how major components interact. It explains
                  the separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase. This document provides a high-level
                  overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase. This document provides a high-level overview of VS
                  Code's architecture, focusing on the multi-process design,
                  core systems, and how major components interact. It explains
                  the separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase.
                </p>

                {/* <div className="architecture-diagram">
                  <div className="diagram-content">
                    <div className="process-box main-process">
                      <h4>Main Process (Electron main.js)</h4>
                      <p>IPC: ProxyIdentifier</p>
                    </div>
                    <div className="process-arrow">→</div>
                    <div className="process-box renderer-process">
                      <h4>Renderer Process</h4>
                      <p>WindowsMainService</p>
                    </div>
                    <div className="process-arrow">→</div>
                    <div className="process-box">
                      <h4>IPC Messages</h4>
                      <p>rpcProtocol</p>
                    </div>
                  </div>
                </div> */}

                <div>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Cumque perspiciatis quam distinctio, aut ipsam saepe facere
                  error blanditiis earum vel numquam quaerat suscipit, molestias
                  voluptates maiores repellendus fugiat dicta delectus.
                </div>
              </section>

              <section
                className="content-section"
                id="process-responsibilities"
              >
                <h2 className="section-title">Process Responsibilities</h2>
                <p className="section-text">
                  Each process in VS Code has specific responsibilities that
                  contribute to the overall architecture and user experience.
                  This document provides a high-level overview of VS Code's
                  architecture, focusing on the multi-process design, core
                  systems, and how major components interact. It explains the
                  separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase. This document provides a high-level
                  overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase.
                </p>
              </section>

              <section className="content-section" id="core-workbench">
                <h2 className="section-title">Core Workbench Architecture</h2>
                <p className="section-text">
                  The workbench serves as the main UI framework that
                  orchestrates all user interface components and interactions.
                  This document provides a high-level overview of VS Code's
                  architecture, focusing on the multi-process design, core
                  systems, and how major components interact. It explains the
                  separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase. This document provides a high-level
                  overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase.
                </p>
              </section>

              <section className="content-section" id="workbench-parts">
                <h2 className="section-title">Workbench Parts</h2>
                <p className="section-text">
                  Different parts of the workbench handle specific functionality
                  and user interactions. This document provides a high-level
                  overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase. This document provides a high-level overview of VS
                  Code's architecture, focusing on the multi-process design,
                  core systems, and how major components interact. It explains
                  the separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase.
                </p>
              </section>

              <section className="content-section" id="extension-system">
                <h2 className="section-title">Extension System Architecture</h2>
                <p className="section-text">
                  The extension system provides a robust platform for
                  third-party developers to extend VS Code's functionality. This
                  document provides a high-level overview of VS Code's
                  architecture, focusing on the multi-process design, core
                  systems, and how major components interact. It explains the
                  separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase. This document provides a high-level
                  overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase.
                </p>
              </section>

              <section className="content-section" id="extension-api">
                <h2 className="section-title">Extension API Surface</h2>
                <p className="section-text">
                  The API surface defines what extensions can access and modify
                  within VS Code. This document provides a high-level overview
                  of VS Code's architecture, focusing on the multi-process
                  design, core systems, and how major components interact. It
                  explains the separation between the main process, renderer
                  process, extension host, and specialized processes, as well as
                  the foundational services and dependency injection patterns
                  used throughout the codebase. This document provides a
                  high-level overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase.
                </p>
              </section>

              <section className="content-section" id="type-converters">
                <h2 className="section-title">Type Converters</h2>
                <p className="section-text">
                  Type converters handle the translation between different data
                  types across process boundaries. This document provides a
                  high-level overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase. This document provides a high-level overview of VS
                  Code's architecture, focusing on the multi-process design,
                  core systems, and how major components interact. It explains
                  the separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase.
                </p>
              </section>

              <section className="content-section" id="dependency-injection">
                <h2 className="section-title">Service Dependency Injection</h2>
                <p className="section-text">
                  VS Code uses dependency injection to manage service lifecycles
                  and dependencies. This document provides a high-level overview
                  of VS Code's architecture, focusing on the multi-process
                  design, core systems, and how major components interact. It
                  explains the separation between the main process, renderer
                  process, extension host, and specialized processes, as well as
                  the foundational services and dependency injection patterns
                  used throughout the codebase. This document provides a
                  high-level overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase.
                </p>
              </section>

              <section className="content-section" id="core-services">
                <h2 className="section-title">Core Service Interfaces</h2>
                <p className="section-text">
                  Core services provide fundamental functionality that other
                  parts of the application depend on. This document provides a
                  high-level overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase. This document provides a high-level overview of VS
                  Code's architecture, focusing on the multi-process design,
                  core systems, and how major components interact. It explains
                  the separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase.
                </p>
              </section>

              <section className="content-section" id="editor-monaco">
                <h2 className="section-title">Editor and Monaco Integration</h2>
                <p className="section-text">
                  The Monaco editor is deeply integrated into VS Code's
                  architecture. This document provides a high-level overview of
                  VS Code's architecture, focusing on the multi-process design,
                  core systems, and how major components interact. It explains
                  the separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase. This document provides a high-level
                  overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase.
                </p>
              </section>

              <section className="content-section" id="editor-config">
                <h2 className="section-title">Editor Configuration</h2>
                <p className="section-text">
                  Editor configuration allows users to customize their editing
                  experience. This document provides a high-level overview of VS
                  Code's architecture, focusing on the multi-process design,
                  core systems, and how major components interact. It explains
                  the separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase. This document provides a high-level
                  overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase.
                </p>
              </section>

              <section className="content-section" id="build-system">
                <h2 className="section-title">Build System and Packaging</h2>
                <p className="section-text">
                  The build system handles compilation, bundling, and packaging
                  of VS Code. This document provides a high-level overview of VS
                  Code's architecture, focusing on the multi-process design,
                  core systems, and how major components interact. It explains
                  the separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase. This document provides a high-level
                  overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase.
                </p>
              </section>

              <section className="content-section" id="build-artifacts">
                <h2 className="section-title">Key Build Artifacts</h2>
                <p className="section-text">
                  Important files and outputs generated during the build
                  process. This document provides a high-level overview of VS
                  Code's architecture, focusing on the multi-process design,
                  core systems, and how major components interact. It explains
                  the separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase. This document provides a high-level
                  overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase.
                </p>
              </section>

              <section className="content-section" id="initialization">
                <h2 className="section-title">Initialization Sequence</h2>
                <p className="section-text">
                  The order in which different parts of VS Code are initialized
                  and started. This document provides a high-level overview of
                  VS Code's architecture, focusing on the multi-process design,
                  core systems, and how major components interact. It explains
                  the separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase. This document provides a high-level
                  overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase.
                </p>
              </section>

              <section className="content-section" id="service-registration">
                <h2 className="section-title">Service Registration Example</h2>
                <p className="section-text">
                  An example of how services are registered and used within the
                  application. This document provides a high-level overview of
                  VS Code's architecture, focusing on the multi-process design,
                  core systems, and how major components interact. It explains
                  the separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase. This document provides a high-level
                  overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase.
                </p>
              </section>

              <section className="content-section" id="platform-support">
                <h2 className="section-title">Platform Support</h2>
                <p className="section-text">
                  How VS Code supports different operating systems and
                  platforms. This document provides a high-level overview of VS
                  Code's architecture, focusing on the multi-process design,
                  core systems, and how major components interact. It explains
                  the separation between the main process, renderer process,
                  extension host, and specialized processes, as well as the
                  foundational services and dependency injection patterns used
                  throughout the codebase. This document provides a high-level
                  overview of VS Code's architecture, focusing on the
                  multi-process design, core systems, and how major components
                  interact. It explains the separation between the main process,
                  renderer process, extension host, and specialized processes,
                  as well as the foundational services and dependency injection
                  patterns used throughout the codebase. This document provides
                  a high-level overview of VS Code's architecture, focusing on
                  the multi-process design, core systems, and how major
                  components interact. It explains the separation between the
                  main process, renderer process, extension host, and
                  specialized processes, as well as the foundational services
                  and dependency injection patterns used throughout the
                  codebase.
                </p>
              </section>
            </main>

            {/* Right Sidebar - On This Page */}
            <aside className="wiki-sidebar-right custscrollA">
              <div className="sidebar-header">
                <h3 className="sidebar-title">On this page</h3>
              </div>
              <nav className="page-nav">
                <ul className="page-nav-list">
                  <li>
                    <a
                      href="#overview"
                      className={`page-nav-link ${
                        activeSection === "overview" ? "active" : ""
                      }`}
                    >
                      VS Code Architecture Overview
                    </a>
                  </li>
                  <li>
                    <a
                      href="#purpose"
                      className={`page-nav-link ${
                        activeSection === "purpose" ? "active" : ""
                      }`}
                    >
                      Purpose and Scope
                    </a>
                  </li>
                  <li>
                    <a
                      href="#multi-process"
                      className={`page-nav-link ${
                        activeSection === "multi-process" ? "active" : ""
                      }`}
                    >
                      Multi-Process Architecture
                    </a>
                  </li>
                  <li>
                    <a
                      href="#process-responsibilities"
                      className={`page-nav-link ${
                        activeSection === "process-responsibilities"
                          ? "active"
                          : ""
                      }`}
                    >
                      Process Responsibilities
                    </a>
                  </li>
                  <li>
                    <a
                      href="#core-workbench"
                      className={`page-nav-link ${
                        activeSection === "core-workbench" ? "active" : ""
                      }`}
                    >
                      Core Workbench Architecture
                    </a>
                  </li>
                  <li>
                    <a
                      href="#workbench-parts"
                      className={`page-nav-link ${
                        activeSection === "workbench-parts" ? "active" : ""
                      }`}
                    >
                      Workbench Parts
                    </a>
                  </li>
                  <li>
                    <a
                      href="#extension-system"
                      className={`page-nav-link ${
                        activeSection === "extension-system" ? "active" : ""
                      }`}
                    >
                      Extension System Architecture
                    </a>
                  </li>
                  <li>
                    <a
                      href="#extension-api"
                      className={`page-nav-link ${
                        activeSection === "extension-api" ? "active" : ""
                      }`}
                    >
                      Extension API Surface
                    </a>
                  </li>
                  <li>
                    <a
                      href="#type-converters"
                      className={`page-nav-link ${
                        activeSection === "type-converters" ? "active" : ""
                      }`}
                    >
                      Type Converters
                    </a>
                  </li>
                  <li>
                    <a
                      href="#dependency-injection"
                      className={`page-nav-link ${
                        activeSection === "dependency-injection" ? "active" : ""
                      }`}
                    >
                      Service Dependency Injection
                    </a>
                  </li>
                  <li>
                    <a
                      href="#core-services"
                      className={`page-nav-link ${
                        activeSection === "core-services" ? "active" : ""
                      }`}
                    >
                      Core Service Interfaces
                    </a>
                  </li>
                  <li>
                    <a
                      href="#editor-monaco"
                      className={`page-nav-link ${
                        activeSection === "editor-monaco" ? "active" : ""
                      }`}
                    >
                      Editor and Monaco Integration
                    </a>
                  </li>
                  <li>
                    <a
                      href="#editor-config"
                      className={`page-nav-link ${
                        activeSection === "editor-config" ? "active" : ""
                      }`}
                    >
                      Editor Configuration
                    </a>
                  </li>
                  <li>
                    <a
                      href="#build-system"
                      className={`page-nav-link ${
                        activeSection === "build-system" ? "active" : ""
                      }`}
                    >
                      Build System and Packaging
                    </a>
                  </li>
                  <li>
                    <a
                      href="#build-artifacts"
                      className={`page-nav-link ${
                        activeSection === "build-artifacts" ? "active" : ""
                      }`}
                    >
                      Key Build Artifacts
                    </a>
                  </li>
                  <li>
                    <a
                      href="#initialization"
                      className={`page-nav-link ${
                        activeSection === "initialization" ? "active" : ""
                      }`}
                    >
                      Initialization Sequence
                    </a>
                  </li>
                  <li>
                    <a
                      href="#service-registration"
                      className={`page-nav-link ${
                        activeSection === "service-registration" ? "active" : ""
                      }`}
                    >
                      Service Registration Example
                    </a>
                  </li>
                  <li>
                    <a
                      href="#platform-support"
                      className={`page-nav-link ${
                        activeSection === "platform-support" ? "active" : ""
                      }`}
                    >
                      Platform Support
                    </a>
                  </li>
                </ul>
              </nav>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default page;
