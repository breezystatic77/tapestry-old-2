import * as Express from 'express'

import config from '../util/config'

export const profilesRouter = Express.Router()

profilesRouter.use(Express.static(config.PROFILES_FOLDER))
