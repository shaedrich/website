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


## Problems encountered along the way

### Animating multiple transitions at once, differently

**width transition 0.0s**

```css
transition:
  transform 0.1s linear,
  width 0.0s linear;
```

<iframe width="100%" height="300" src="//jsfiddle.net/NullVoxPopuli/sp96rht1/17/embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

The issue here is that, when opening, the width animation completes before the transform, revealing the background behind the main content before the animation has finished. 

**width transition matches transform**
```css
transition:
  transform 0.1s linear,
  width 0.1s linear;
```
<iframe width="100%" height="300" src="//jsfiddle.net/NullVoxPopuli/bfL4dnw3/embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

Even though this fixes the opening problem, we now have an issue that, when closing, the width animation isn't completed fast enough, so we again see the background behind the main content.

**solution?**

Since we have two different sets of transitions that are both correct and incorrect in each other's incorrect and correct situation, we need to dynamically change the transition before toggling.

<iframe width="100%" height="300" src="//jsfiddle.net/NullVoxPopuli/q5zn6uy0/2/embedded/result/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

Before opening or closing, we need to set the transition, like so:
```ts
if (isClosing) {
    content.style.transition = `
    	width 0.0s linear, transform 0.1s linear
    `;
  } else {
    content.style.transition = `
    	width 0.1s linear, transform 0.1s linear
    `;
  }
```