import chai from 'chai'

import agent from '../agent.js'
import { user, updatedFile } from '../dummy-user.js'

const { expect } = chai

setTimeout(function () {
  describe('Download', function () {
    it('should send a file', async function () {
      const res = await agent
        .get(`/${user.notes[user.notes.length - 1]._id}/file`)
        .buffer()

      expect(res.body).to.deep.equal(updatedFile.file)
    })
  })
}, 1000)
