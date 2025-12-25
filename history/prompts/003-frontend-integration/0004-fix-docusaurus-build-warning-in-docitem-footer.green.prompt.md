---
id: 0004
title: Fix Docusaurus build warning in DocItem/Footer
stage: green
date: 2025-12-13
surface: agent
model: gemini-1.5-pro-001
feature: 003-frontend-integration
branch: main
user: unknown
command: unknown
labels: ["bugfix", "docusaurus", "frontend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
- frontend/src/theme/DocItem/Footer/index.tsx
tests:
- npm run build
---

## Prompt

Get I found below error in the RUN in browser

[WARNING] {"moduleIdentifier":"D:\\CLI PROJECTS\\hackathon-1-new\\frontend\\node_modules\\babel-loader\\lib\\index.js??ruleSet[1].rules[5].use[0]!D:\\CLI PROJECTS\\hackathon-1-new\\frontend\\src\\theme\\DocItem\\Footer\\index.tsx","moduleName":"./src/theme/DocItem/Footer/index.tsx","loc":"9:2-8","message":"export 'useDoc' (imported as 'useDoc') was not found in '@docusaurus/theme-common' (possible exports: Collapsible, DraftBannerMessage, DraftBannerTitle, ErrorBoundaryError, ErrorBoundaryErrorMessageFallback, ErrorBoundaryTryAgainButton, ErrorCauseBoundary, HtmlClassNameProvider, NavbarSecondaryMenuFiller, PageMetadata, ReactContextError, SkipToContentFallbackId, SkipToContentLink, ThemeClassNames, ThemedComponent, UnlistedBannerMessage, UnlistedBannerTitle, UnlistedMetadata, composeProviders, createStorageSlot, duplicates, filterDocCardListItems, groupBy, isMultiColumnFooterLinks, isRegexpStringMatch, listStorageKeys, listTagsByLetters, mergeSearchParams, mergeSearchStrings, prefersReducedMotion, processAdmonitionProps, translateTagsPageTitle, uniq, useAnchorTargetClassName, useClearQueryString, useCollapsible, useColorMode, useContextualSearchFilters, useCurrentSidebarCategory, useDocsPreferredVersion, useEvent, useHistorySelector, usePluralForm, usePrevious, usePrismTheme, useQueryString, useQueryStringList, useSearchLinkCreator, useSearchQueryString, useStorageSlot, useThemeConfig, useWindowSize)"}
client (webpack 5.103.0) compiled with 1 warning

## Response snapshot

The build was successful and there are no more warnings.

## Outcome

- ✅ Impact: Fixed a build warning in the frontend.
- 🧪 Tests: The frontend build is now successful without any warnings.
- 📁 Files: Modified one file to fix the import of `useDoc`.
- 🔁 Next prompts: none
- 🧠 Reflection: The `useDoc` hook is not a public API and its location can change between versions. The correct way to get the doc context is to use `useDoc` from `@docusaurus/plugin-content-docs/client`.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (if applicable): none
