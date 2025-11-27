import jetEnv, { num } from 'jet-env';
import { isEnumVal } from 'jet-validators';

import { NodeEnvs } from '.';
import { M } from 'vitest/dist/chunks/reporters.d.BFLkQcL6';


/******************************************************************************
                                 Setup
******************************************************************************/

const ENV = jetEnv({
  NodeEnv: isEnumVal(NodeEnvs),
  Port: num,
  Mongodb: String,
  Jwtsecret: String,
});


/******************************************************************************
                            Export default
******************************************************************************/

export default ENV;
