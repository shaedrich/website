---
title: Performant Gesture Enabled Sidebar for the Web
image: /images/william-bayreuther-CBtV8oL5dlo-unsplash.jpg
imageMeta:
  attribution:
  attributionLink: https://unsplash.com/photos/CBtV8oL5dlo
featured: true
authors: 
  - nullvoxpopuli
date: Sun Aug 18 2019 21:42:35 GMT-0400 (Eastern Daylight Time)
tags:
  - emberclear
  - frontend
  - javascript
---

# Performant Gesture-enabled Sidebar for the Web

Previously, emberclear (a side project I work / experiment with), used css transitions _only_ to have a breakpoint-varied sidebar navigation animations for opening and closing.  At the time, I was using SASS, and was able to achieve open and close via adding and removing a class.

```scss
.sidebar-container {
  position: fixed;
  background: $sidebar-background;
  z-index: 29;
  box-shadow: $box-shadow;
  min-width: 250px;


  &.is-sidebar-hidden {
    left: -300px;
  }

  &.is-sidebar-visible {
    left: 0;

    .sidebar-buttons {
      border-right: 1px solid darken($sidebar-background, 10%);
    }
  }

  .sidebar-buttons {
    display: none;
    position: absolute;
    left: 0px;
    bottom: 0px;
    top: 52px;
    width: 3.25rem;
    z-index: 31;
    background: $sidebar-background;
  }

  aside {
    height: 100vh;
    overflow-y: auto;
  }

  .sidebar-wrapper {
    width: 100%;
    z-index: 30;

    .menu-label {
      position: sticky;
      top: 0px;
      background: white;
      z-index: 1;
      padding-bottom: 8px;
      // padding-top: 8px;
    }
  }

  .sidebar-underlay {
    visibility: hidden;
    opacity: 0;
    background: rgba(0,0,0,0.12);
    z-index: 29;
  }


  .offcanvas-trigger {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 31;
  }
}


@include mobile {
  .sidebar-container {
    top: 0px;
    z-index: 31;

    &.is-sidebar-visible {
      .sidebar-underlay {
        visibility: visible;
        opacity: 1;
      }
    }

    .offcanvas-trigger {
      display: none;
    }
  }
}

@include tablet-only {
  .sidebar-container {
    min-width: 240px;
    top: 0px;
    z-index: 31;
  }
}

@include desktop {
  .sidebar-container {
    position: static;
    @include default-transition;

    .sidebar-wrapper {
      width: 100%;
      @include default-transition;
    }

    .sidebar-buttons {
      display: block;
    }

    &.is-sidebar-hidden {
      min-width: 3.25rem;
      width: 3.25rem;

      .sidebar-wrapper {
        margin-left: -100%;
      }
    }

    &.is-sidebar-visible {
      left: 3.25rem;
      min-width: 16rem;
      width: 16rem;

      .sidebar-wrapper {
        margin-left: 3.25rem;
      }
    }
  }
}
```

// TODO: create codesandbox demo or something

The scss is fairly concise, but has its limitations. I wanted to add gestures -- specifically for the ability to swipe open and swipe close the sidebar.  

First, the sidebar is going to be re-designed a bit. There were too many visual state permutations, so maintaining each of those via javascript would be just that much more painful. Why JavaScript? For CSS, the only properties currently supporting touch are [scroll snapping](https://css-tricks.com/practical-css-scroll-snapping/). On mobile devices, we want our new sidebar to have some overlap so that we have an illusion of depth within the app.

There are a number of approaches a person could take to implement gestures:
1. Native JS
2. Ecosystem-Specific library (react-use-gesture, ember-mobile-menu, etc)
3. JS Library, ecosystem-agnostic

## Native JS

This is the most verbose of of the options. There are 6 events to track 

## Ecosystem Specific

## JS Library


```ts
import Hammer from 'hammerjs';

interface Args {
  content: HTMLElement;
  sidebarWidth: number;
  flickRegion: number;
}

/**
 * NOTE: does not support dynamic width sidebar
 * NOTE: this only works for a sidebar on the left
 */
export class SwipeHandler {
  /**
   * The content to be moved. Not the sidebar
   */
  content: HTMLElement;

  /**
   * Width of the sidebar. This determines how much movement to allow.
   */
  sidebarWidth: number;

  /**
   * The percent of the sidebar width to allow flicking fully open / closed.
   */
  flickRegion: number;

  private openThreshold: number;
  private closeThreshold: number;

  private isDragging = false;
  private initialX = 0;
  private isOpening = false;
  private isClosing = false;

  constructor({ content, sidebarWidth, flickRegion }: Args) {
    this.content = content;
    this.sidebarWidth = sidebarWidth;
    this.flickRegion = flickRegion;

    this.openThreshold = sidebarWidth * flickRegion;
    this.closeThreshold = sidebarWidth * (1 - flickRegion);
  }

  start() {
    let hammertime = new Hammer(document.body);

    hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    hammertime.on('panleft panright panend', e => {
      switch (e.type) {
        case 'panleft':
          return this.handleDrag(e);
        case 'panright':
          return this.handleDrag(e);
        case 'panend':
          return this.handleDrag(e);
        default:
          console.info('gesture not handled', e);
      }
    });
  }

  handleDrag(e: HammerStatic['Input']) {
    if (!this.isDragging) {
      this.isDragging = true;
      this.initialX = this.content.getBoundingClientRect().left;
    }

    // direction is none on a final event / panend
    if (e.direction !== Hammer.DIRECTION_NONE) {
      this.isOpening = e.direction === Hammer.DIRECTION_RIGHT;
      this.isClosing = e.direction === Hammer.DIRECTION_LEFT;
    }

    let deltaXFromStart = e.deltaX;
    let nextX = deltaXFromStart + this.initialX;
    let shouldClose = nextX < this.closeThreshold;
    let shouldOpen = nextX > this.openThreshold;
    let isFullyOpen = nextX >= this.sidebarWidth;
    let isFullyClosed = nextX <= 0;

    if (isFullyOpen) {
      nextX = this.sidebarWidth;
    } else if (isFullyClosed) {
      nextX = 0;
    }

    if (e.isFinal) {
      this.isDragging = false;

      // is far enough?
      if (this.isClosing) {
        if (shouldClose) {
          nextX = 0;
        } else {
          nextX = this.sidebarWidth;
        }
      } else if (this.isOpening) {
        if (shouldOpen) {
          nextX = this.sidebarWidth;
        } else {
          nextX = 0;
        }
      }
    }

    this.content.style.setProperty('--dx', `${nextX}px`);
    this.content.style.setProperty('width', `${window.innerWidth - nextX}px`);
    this.content.style.transform = `translateX(${nextX}px)`;
  }
}
```