import {
  FloatingArrow,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  arrow,
  autoPlacement,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
  useTransitionStyles
} from '@floating-ui/react';
import { Logger } from '@lib/common/logger';
import { BlockUI } from 'primereact/blockui';
import { CSSProperties, ReactNode, forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import SMButton from './SMButton';
import { SMCard } from './SMCard';
import { CombinedProvider } from './context/CombinedContext';
import { SMOverlayProperties } from './interfaces/SMOverlayProperties';

export interface SMOverlayRef {
  getOpen: () => boolean;
  hide: () => void;
  show: (event: any) => void;
}

interface ExtendedSMOverlayProperties extends SMOverlayProperties {
  readonly children?: ReactNode;
}

const ARROW_HEIGHT = 12;
const ARROW_HEIGHT_OFFSET = ARROW_HEIGHT - 4;
const DISALLOWED_CLOSE_REASONS = ['escape-key', 'outside-press'];

const SMOverlayInner = forwardRef<SMOverlayRef, ExtendedSMOverlayProperties>(
  (
    {
      autoPlacement: innerAutoPlacement = false,
      buttonDisabled = false,
      closeOnLostFocus = false,
      contentWidthSize = '4',
      isOverLayLoading = false,
      modalClosable = false,
      placement = 'bottom',
      showClose = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const arrowRef = useRef(null);
    const headingId = useId();

    const middleware = useMemo(() => {
      if (props.modalCentered) {
        return [arrow({ element: arrowRef })];
      }

      return innerAutoPlacement
        ? [offset(() => ARROW_HEIGHT_OFFSET, [ARROW_HEIGHT_OFFSET]), autoPlacement(), arrow({ element: arrowRef })]
        : [offset(() => ARROW_HEIGHT_OFFSET, [ARROW_HEIGHT_OFFSET]), shift(), flip(), arrow({ element: arrowRef })];
    }, [innerAutoPlacement, props.modalCentered]);

    const { refs, floatingStyles, context } = useFloating({
      middleware,
      onOpenChange(nextOpen, event, reason) {
        Logger.debug('onOpenChange', { closeOnLostFocus: closeOnLostFocus, event, reason });

        if (reason && !DISALLOWED_CLOSE_REASONS.includes(reason)) {
          if (props.modal && !modalClosable && !nextOpen) return;
        }

        if (!event?.type || (!closeOnLostFocus && event.type === 'focusout') || (props.modal && event.type === 'focusout')) {
          changeOpen(nextOpen ?? false);
          return;
        }

        changeOpen(nextOpen ?? false);
      },
      open: isOpen,
      placement,
      strategy: 'absolute',
      transform: true,
      whileElementsMounted: autoUpdate
    });

    const { styles: transitionStyles } = useTransitionStyles(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([useClick(context), useDismiss(context), useRole(context)]);

    const changeOpen = useCallback(
      (open: boolean) => {
        setIsOpen(open);
        props.onOpen?.(open);
      },
      [props]
    );

    useImperativeHandle(ref, () => ({
      getOpen: () => {
        return isOpen;
      },
      hide: () => changeOpen(false),
      show: () => changeOpen(true)
    }));

    const openPanel = useCallback(
      (isOpen: boolean) => {
        if (props.answer !== undefined) {
          props.onAnswered?.();
          return;
        }
        changeOpen(isOpen);
        if (isOpen === false) {
          props.onCloseClick?.();
        }
      },
      [changeOpen, props]
    );

    const content = useMemo(() => {
      return (
        <SMCard {...props} openPanel={openPanel}>
          {props.children}
        </SMCard>
      );
    }, [openPanel, props]);

    const getStyle = useMemo((): CSSProperties => {
      if (props.modalCentered) {
        return { left: '50%', position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', width: '100%' };
      }
      return floatingStyles;
    }, [props.modalCentered, floatingStyles]);

    const z = useMemo(() => {
      if (props.modal) {
        return 10;
      }
      return props.zIndex;
    }, [props.modal, props.zIndex]);
    return (
      <>
        <SMButton
          buttonClassName={props.buttonClassName}
          buttonDarkBackground={props.buttonDarkBackground}
          buttonDisabled={buttonDisabled}
          buttonLarge={props.buttonLarge}
          getReferenceProps={getReferenceProps}
          menu={props.menu}
          icon={props.icon}
          iconFilled={props.iconFilled}
          label={props.buttonLabel}
          refs={refs}
          tooltip={props.tooltip}
          {...props}
        >
          {props.buttonTemplate}
        </SMButton>
        {!buttonDisabled && (
          <FloatingPortal>
            {isOpen && (
              <>
                <FloatingOverlay className={props.modal ? 'sm-dialog-overlay' : ''} lockScroll />
                <FloatingFocusManager context={context} modal={props.modal}>
                  <div
                    className={`sm-overlay sm-popover sm-w-${contentWidthSize} pt-2 ${z !== undefined ? 'z-' + z : ''} ${props.modal ? 'sm-modal' : ''}`}
                    ref={refs.setFloating}
                    style={getStyle}
                    aria-labelledby={headingId}
                    {...getFloatingProps()}
                  >
                    {props.modalCentered !== true && (
                      <FloatingArrow ref={arrowRef} context={context} height={ARROW_HEIGHT} fill="var(--surface-border)" tipRadius={4} />
                    )}
                    <div className="w-full" style={transitionStyles}>
                      <BlockUI blocked={isOverLayLoading}>{content}</BlockUI>
                    </div>
                  </div>
                </FloatingFocusManager>
              </>
            )}
          </FloatingPortal>
        )}
      </>
    );
  }
);

const SMOverlay = forwardRef<SMOverlayRef, ExtendedSMOverlayProperties>((props, ref) => (
  <CombinedProvider>
    <SMOverlayInner ref={ref} {...props} />
  </CombinedProvider>
));

export default SMOverlay;
