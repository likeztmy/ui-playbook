import { Frame } from '../shell';
import { Walk } from './Walk';

/** The page's opening scene: the walk in a standard sheet, to drag and to use the map behind. */
export function SheetScene() {
  return (
    <Frame label="Standard sheet: the map stays in use until the sheet covers it" height={0}>
      <Walk />
    </Frame>
  );
}
