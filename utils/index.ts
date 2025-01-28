import { Map } from '@/types/Sheet';

export const timeStrToNumber = (time: string): number => {
  const [minutes, seconds] = time.split(':');
  const [sec, millis] = seconds.split('.');
  return (
    parseInt(minutes) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(millis)
  );
};

export const timeNumberToStr = (time: number): string => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const millis = time % 1000;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
};

export const upperFirst = (str: string): string => {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
};

export const getMapFromName = (arr: Map[], name: string): Map => {
  return arr.find((item: Map) => item.label === name);
};

export const uniqueStr = (): string => {
  return `${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;
};
