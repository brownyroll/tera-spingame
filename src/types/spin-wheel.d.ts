declare module 'spin-wheel' {
  export interface WheelItem {
    label?: string;
    backgroundColor?: string;
    labelColor?: string;
    weight?: number;
    image?: HTMLImageElement;
    imageRadius?: number;
    imageRotation?: number;
    imageScale?: number;
  }

  export interface WheelProps {
    items?: WheelItem[];
    borderColor?: string;
    borderWidth?: number;
    debug?: boolean;
    image?: HTMLImageElement;
    isInteractive?: boolean;
    itemBackgroundColors?: string[];
    itemLabelAlign?: string;
    itemLabelBaselineOffset?: number;
    itemLabelColors?: string[];
    itemLabelFont?: string;
    itemLabelFontSizeMax?: number;
    itemLabelRadius?: number;
    itemLabelRadiusMax?: number;
    itemLabelRotation?: number;
    itemLabelStrokeColor?: string;
    itemLabelStrokeWidth?: number;
    lineColor?: string;
    lineWidth?: number;
    offset?: { x: number; y: number };
    onCurrentIndexChange?: (event: { currentIndex: number }) => void;
    onRest?: (event: { currentIndex: number; rotation: number }) => void;
    onSpin?: (event: { method: string; duration: number; rotation: number }) => void;
    overlayImage?: HTMLImageElement;
    pixelRatio?: number;
    pointerAngle?: number;
    radius?: number;
    rotation?: number;
    rotationResistance?: number;
    rotationSpeed?: number;
    rotationSpeedMax?: number;
  }

  export class Wheel {
    constructor(container: HTMLElement, props?: WheelProps);

    items: WheelItem[];
    borderColor: string;
    borderWidth: number;
    debug: boolean;
    isInteractive: boolean;
    itemBackgroundColors: string[];
    itemLabelAlign: string;
    itemLabelBaselineOffset: number;
    itemLabelColors: string[];
    itemLabelFont: string;
    itemLabelFontSizeMax: number;
    itemLabelRadius: number;
    itemLabelRadiusMax: number;
    itemLabelRotation: number;
    itemLabelStrokeColor: string;
    itemLabelStrokeWidth: number;
    lineColor: string;
    lineWidth: number;
    pixelRatio: number;
    pointerAngle: number;
    radius: number;
    rotation: number;
    rotationResistance: number;
    rotationSpeed: number;
    rotationSpeedMax: number;
    currentIndex: number;

    onCurrentIndexChange: ((event: { currentIndex: number }) => void) | null;
    onRest: ((event: { currentIndex: number; rotation: number }) => void) | null;
    onSpin: ((event: { method: string; duration: number; rotation: number }) => void) | null;

    spin(rotationSpeed?: number): void;
    spinTo(
      rotation: number,
      duration?: number,
      easingFunction?: (t: number) => number
    ): void;
    spinToItem(
      itemIndex: number,
      duration?: number,
      spinToCenter?: boolean,
      numberOfRevolutions?: number,
      direction?: number,
      easingFunction?: (t: number) => number
    ): void;
    stop(): void;
    resize(): void;
    remove(): void;
  }
}
