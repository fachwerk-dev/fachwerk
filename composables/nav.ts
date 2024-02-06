export function useNav(pages: any, pagesEl: any, focused: any) {
  const activePage = ref(0);
  const next = () => {
    console.log("next");
    if (activePage.value < pages.value.length - 1) {
      activePage.value++;
    }
  };
  const prev = () => {
    if (activePage.value > 0) {
      activePage.value--;
    }
  };

  const { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, Space, Shift } =
    useMagicKeys();
  watch([ArrowUp, ArrowRight, ArrowDown, ArrowLeft, Space, Shift], () => {
    if (!focused.value) {
      if (ArrowLeft.value || ArrowUp.value) {
        prev();
      }
      if (ArrowRight.value || ArrowDown.value) {
        next();
      }
      if (Space.value) {
        if (Shift.value) {
          prev();
        } else {
          next();
        }
      }
    }
  });

  // const { isSwiping, direction } = useSwipe(pagesEl);
  // watch([isSwiping, direction], () => {
  //   if (direction.value === "right" || direction.value === "down") {
  //     prev();
  //   }
  //   if (direction.value === "left" || direction.value === "up") {
  //     console.log(activePage.value);
  //     activePage.value++;
  //     next();
  //   }
  // });
  return { activePage, next, prev };
}
