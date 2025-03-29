import classNames from 'classnames';
import { Children, cloneElement, ReactElement, Ref, useEffect, useRef, useState  } from 'react';
import { useMergeRefs } from 'use-callback-ref';

interface Props {
  children: ReactElement<{ className?: string; ref?: Ref<unknown> }>;
  classNames: {
    default?: string;
    hovered?: string;
  };
}

export const Hoverable = (props: Props) => {
  const child = Children.only(props.children);
  const elementRef = useRef<HTMLDivElement>(null);

  const mergedRef = useMergeRefs([elementRef, child.props.ref].filter((v) => v != null));

  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const elementRect = elementRef.current?.getBoundingClientRect();

  const hovered =
    elementRect != null &&
    elementRect.left <= pointer.x &&
    pointer.x <= elementRect.right &&
    elementRect.top <= pointer.y &&
    pointer.y <= elementRect.bottom;

    useEffect(() => {
      if (!mergedRef.current) return;
  
      const handlePointerMove = (ev: MouseEvent) => {
        setPointer({ x: ev.clientX, y: ev.clientY });
      };
  
      window.addEventListener('pointermove', handlePointerMove);
  
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
      };
    }, [mergedRef, setPointer]);

  return cloneElement(child, {
    className: classNames(
      child.props.className,
      'cursor-pointer',
      hovered ? props.classNames.hovered : props.classNames.default,
    ),
    ref: mergedRef,
  });
};
