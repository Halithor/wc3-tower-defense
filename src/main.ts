import {Game} from 'game';
import {addScriptHook, Quest, W3TS_HOOK} from 'w3lib';

const BUILD_DATE = compiletime(() => new Date().toUTCString());

function tsMain() {
  const infoQuest = new Quest();
  infoQuest.discovered = true;
  infoQuest.setTitle('Map Info');
  infoQuest.setDescription(
    `Map by Halithor\nBuilt ${BUILD_DATE}\nWritten in TypeScript`
  );
  infoQuest.required = false;
  infoQuest.enabled = true;

  try {
    new Game().start();
  } catch (e) {
    print(e);
  }
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);
