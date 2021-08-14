# Cool Space Things
[Cool Space Things](https://coolspacethings.neocities.org/), or n2yovis, is a
visualization of satellite launch dates against their apogee/perigee. It
encompasses all publically available satellites which have a NORAD ID; these
number over 47,000 objects since 1957!

## Dataset
n2yo's dataset is public and freely usable, but we couldn't any documentation
about its distribution rights. However, we prepared a tool to capture the data
from <n2yo.com> for this project, available
[here](https://github.com/jmfrees/n2yo-scraper).

If you are examining this project and find it lacking a dataset, follow the
instructions in that project to capture and format your own `n2yo.json` and
place it in `$PWD/app/static/n2yo.json`

## How to Use
### Prerequisites
Ensure Docker is available on your system. If you are running a Windows Home
Edition or other non-professional variant of Windows, you should look into
Windows Subsystem for Linux!

### Setup Instructions
##### First Time Setup
In `$PWD`, `make start`. Then open a browser and navigate to
<http://localhost/>. Don't forget the dataset: it doesn't come with this
project!

If the application is already running, or has existing build files, you will
nead to respectively `make reset` or `make remove` then `make start` again.

### Website Instructions
##### Graph Controls
- The bar on the top of the page selects the year to render. It ranges from 1957
  to 2021, and defaults to 2020.
  - Once you have clicked on the bar or selector on the bar, you can also
    navigate with the arrow keys.
- The "Graphing Apogee" sign to the right of the bar is a button. It switches
  between graphing Apogee and Perigee of all objects in the current year.
  - In years where the furthest satellites are particularly distant, you may
    spot a surprise in the upper right quadrant of the calendar!
- If you hold shift and scroll up with your mouse over the calendar, you'll be
  able to zoom in to a high level of detail into any part of the calendar,
  dicated by your mouse position. Try zooming into the many satellites
  surrounding the Earth- there are more than you think!
  - You can zoom back out by again holding shift then scrolling down.

### Shutdown Instructions
In `$PWD`, `make clean`.

## Future Additions
- [X] Optimize the dataset to exclude empty keys, saving on app load time
- [ ] When hovering over legend elements, highlight matching satellites
- [ ] Make the slider and buttons fancier!
- [ ] Optimize the behavior and rendering of the calendar for responsiveness
- [ ] Correct year text appearance; thin black outline is missing?
- [ ] Use a CSS library for formatting the slider bar so its appearance is more
      consistent on both Chrome and Firefox
- [ ] When mousing over satellites, move them apart from one another so they are
      individually accessible
- [ ] Add an upload script to make updating the app easier
- [ ] Reduce the number of Make targets, avoiding redundancy

---
###### ETC.
authors:
  - Gregory Danielson III (@gregdan3, gregdan3@protonmail.com)
  - Jonathan Frees (@jmfrees, jmfrees@uab.edu)
