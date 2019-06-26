import v1 from 'uuid/v1';
import v4 from 'uuid/v4';
import v5 from 'uuid/v5';

export interface UUID {
  v1: typeof v1;
  v4: typeof v4;
  v5: typeof v5;
}

declare module 'vue/types/vue' {
  interface VueConstructor {

    /**
     * An object with uuid's v1, v4 and v5 functions.
     */
    $uuid: UUID;
  }
}