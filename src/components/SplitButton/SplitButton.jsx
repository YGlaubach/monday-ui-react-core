// Libraries import
import React, { useCallback, useMemo, useRef, useState } from "react";
import cx from "classnames";
import PropTypes from "prop-types";

// Constants import
import { keyCodes } from "../../constants/KeyCodes";

// Utils import
import { NOOP } from "../../utils/function-utils";
import { isInsideClass } from "../../utils/dom-utils";

// Hooks import
import useKeyEvent from "../../hooks/useKeyEvent";

// Components import
import Button from "../Button/Button";
import Dialog from "../Dialog/Dialog";
import useEventListener from "../../hooks/useEventListener";
import DropdownChevronDown from "../Icon/Icons/components/DropdownChevronDown";

// SCSS import
import "./SplitButton.scss";

// Constants
const DIALOG_MOVE_BY = { main: 8, secondary: 0 };
const DIALOG_POSITION = "bottom-start";
const DEFAULT_DIALOG_SHOW_TRIGGER = "click";
const DEFAULT_DIALOG_HIDE_TRIGGER = ["clickoutside", "click", "esckey"];
const SECONDARY_BUTTON_WRAPPER_CLASSNAME =
  "monday-style-split-button__secondary-button-wrapper";
const EMPTY_ARR = [];

const SplitButton = ({
  marginLeft,
  marginRight,
  success,
  loading,
  children,
  leftIcon,
  rightIcon,
  color,
  kind,
  className,
  onClick,
  secondaryDialogContent,
  onSecondaryDialogDidShow,
  onSecondaryDialogDidHide,
  disabled,
  shouldCloseOnClickInsideDialog,
  ...buttonProps
}) => {
  // State //
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isHovered, setIsHover] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Refs //
  const ref = useRef(null);

  // Callbacks //
  const setHovered = useCallback(() => setIsHover(true), [setIsHover]);
  const setNotHovered = useCallback(() => setIsHover(false), [setIsHover]);

  const shouldSetActive = useCallback(
    e => {
      if (disabled) return false;
      return !isInsideClass(e.target, SECONDARY_BUTTON_WRAPPER_CLASSNAME);
    },
    [disabled]
  );

  const setActive = useCallback(
    e => {
      if (!shouldSetActive(e)) return;
      setIsActive(true);
    },
    [setIsActive, disabled]
  );
  const setNotActive = useCallback(() => setIsActive(false), [setIsActive]);
  const setActiveOnEnter = useCallback(
    e => {
      if (!shouldSetActive(e)) return;
      setIsActive(true);
    },
    [setIsActive, disabled]
  );

  const showDialog = useCallback(() => {
    setDialogOpen(true);
    onSecondaryDialogDidShow();
  }, [setDialogOpen, onSecondaryDialogDidShow]);

  const hideDialog = useCallback(() => {
    setDialogOpen(false);
    onSecondaryDialogDidHide();
  }, [setDialogOpen, onSecondaryDialogDidHide]);

  // Event listeners //

  // Used to set both buttons as hovered no matter what button was hovered
  useEventListener({ eventName: "mouseenter", callback: setHovered, ref });
  useEventListener({ eventName: "mouseleave", callback: setNotHovered, ref });

  useEventListener({ eventName: "mousedown", callback: setActive, ref });
  useEventListener({ eventName: "mouseup", callback: setNotActive, ref });

  // Used to finish active transition if clicked on enter
  useEventListener({ eventName: "transitionend", callback: setNotActive, ref });

  // Key events
  useKeyEvent({ keys: [keyCodes.ENTER], ref, callback: setActiveOnEnter });

  // We won't show the secondary button in case of success or loading
  const shouldRenderSplitContent = !(success || loading);

  const classNames = useMemo(
    () =>
      cx(
        "monday-style-split-button",
        `monday-style-split-button--kind-${kind}`,
        `monday-style-split-button--color-${color}`,
        {
          "monday-style-split-button--active": isActive,
          "monday-style-split-button--split-content-open": isDialogOpen,
          "monday-style-split-button--hovered": isHovered,
          "monday-style-split-button--disabled": disabled
        },
        className
      ),
    [className, kind, color, isActive, isDialogOpen, isHovered, disabled]
  );

  const dialogShowTrigger = useMemo(
    () => (disabled ? EMPTY_ARR : DEFAULT_DIALOG_SHOW_TRIGGER),
    [disabled]
  );

  const dialogHideTrigger = useMemo(() => {
    if (shouldCloseOnClickInsideDialog)
      return [...DEFAULT_DIALOG_HIDE_TRIGGER, "onContentClick"];
    return DEFAULT_DIALOG_HIDE_TRIGGER;
  }, [shouldCloseOnClickInsideDialog]);

  return (
    <div className={classNames} ref={ref} role="button">
      <Button
        {
          ...buttonProps /* We are enriching button with other props so we must use spreading */
        }
        preventClickAnimation
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        rightFlat
        color={color}
        kind={kind}
        onClick={onClick}
        className="monday-style-split-button__main-button"
        marginLeft={marginLeft}
        onFocus={setHovered}
        onBlur={setNotHovered}
        disabled={disabled}
      >
        {children}
      </Button>
      {shouldRenderSplitContent && (
        <div className={SECONDARY_BUTTON_WRAPPER_CLASSNAME}>
          <Dialog
            // open={isDialogOpen}
            content={secondaryDialogContent}
            position="bottom-start"
            startingEdge="bottom"
            animationType="expand"
            moveBy={DIALOG_MOVE_BY}
            onDialogDidShow={showDialog}
            onDialogDidHide={hideDialog}
            showTrigger={dialogShowTrigger}
            hideTrigger={dialogHideTrigger}
          >
            <Button
              {...buttonProps}
              preventClickAnimation
              leftFlat
              noSidePadding
              color={color}
              kind={kind}
              className="monday-style-split-button__secondary-button"
              active={isDialogOpen}
              marginRight={marginRight}
              onFocus={setHovered}
              onBlur={setNotHovered}
              disabled={disabled}
              ariaLabel="additional actions"
              aria-haspopup="true"
              aria-expanded={isDialogOpen}
            >
              <div className="monday-style-split-button__secondary-button-icon-wrapper">
                <DropdownChevronDown />
              </div>
            </Button>
          </Dialog>
        </div>
      )}
    </div>
  );
};

SplitButton.defaultProps = {
  ...Button.defaultProps,
  onSecondaryDialogDidShow: NOOP,
  onSecondaryDialogDidHide: NOOP
};

SplitButton.propTypes = {
  ...Button.propTypes,
  secondaryDialogContent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]).isRequired,
  onSecondaryDialogDidShow: PropTypes.func,
  onSecondaryDialogDidHide: PropTypes.func
};

SplitButton.sizes = Button.sizes;
SplitButton.colors = Button.colors;
SplitButton.kinds = Button.kinds;
SplitButton.inputTags = Button.inputTags;

export default SplitButton;
