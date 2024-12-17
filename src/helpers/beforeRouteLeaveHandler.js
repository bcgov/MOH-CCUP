import pageStateService from "@/services/page-state-service.js";
import { isPastPath } from "@/router/index.js";
import { scrollTo } from "../helpers/scroll";

//this function accepts three arguments passed down by Vue to the beforeRouteLeave() hook
//"to" and "from" are objects containing a "path" property
//"next" is a function that must be called exactly once in a given pass through the navigation guard
//refer to Vue navigation guard documentation for more info

const beforeRouteLeaveHandler = (to, from, next) => {
  pageStateService.setPageIncomplete(from.path);
  if (pageStateService.isPageComplete(to.path) || isPastPath(to.path, from.path)) {
    next();
  } else {
    // Cancel navigation, reroute to previous path.
    next({
      path: from.path,
      replace: true,
    });
    setTimeout(() => {
      scrollTo(0);
    }, 0);
  }
  return;
};

export default beforeRouteLeaveHandler;
