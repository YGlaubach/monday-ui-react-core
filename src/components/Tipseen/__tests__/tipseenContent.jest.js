import React from "react";
import { fireEvent, render, cleanup } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";
import TipseenContent from "../TipseenContent";
import renderer from "react-test-renderer";
import { DISMISS_BUTTON_TEXT, SUBMIT_BUTTON_TEXT, TIPSEEN_CLOSE_BUTTON_TEST_ID } from "../TipseenConstants";

jest.useFakeTimers();
const renderComponent = ({ ...props }) => {
  return render(<TipseenContent {...props}>content</TipseenContent>);
};

describe("Tipseen content tests", () => {
  describe("Snapshot Tests", () => {
    it("renders correctly", () => {
      const tree = renderer
        .create(
          <TipseenContent title="title" isDismissHidden={false}>
            content
          </TipseenContent>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    it("renders correctly with empty props", () => {
      const tree = renderer.create(<TipseenContent />).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it("renders correctly without title", () => {
      const tree = renderer.create(<TipseenContent>content</TipseenContent>).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it("renders correctly without dismiss button", () => {
      const tree = renderer.create(<TipseenContent isDismissHidden>content</TipseenContent>).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it("renders correctly without submit button", () => {
      const tree = renderer
        .create(
          <TipseenContent children="content" isSubmitHidden>
            content
          </TipseenContent>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
  describe("Integration Tests", () => {
    afterEach(() => {
      cleanup();
    });

    it("call onDismiss function when click on dismiss button", () => {
      const onClickMock = jest.fn();
      const dismissButtonProps = {
        onClick: onClickMock
      };

      const tipseenContent = renderComponent({
        isDismissHidden: false,
        dismissButtonProps
      });
      const dismissButton = tipseenContent.getByText(DISMISS_BUTTON_TEXT);

      act(() => {
        fireEvent.click(dismissButton);
      });
      expect(onClickMock.mock.calls.length).toBe(1);
    });

    it("call onSubmit function when click on dismiss button", () => {
      const onClickMock = jest.fn();
      const submitButtonProps = {
        onClick: onClickMock
      };
      const tipseenContent = renderComponent({
        submitButtonProps
      });
      const submitButton = tipseenContent.getByText(SUBMIT_BUTTON_TEXT);

      act(() => {
        fireEvent.click(submitButton);
      });
      expect(onClickMock.mock.calls.length).toBe(1);
    });
  });
});