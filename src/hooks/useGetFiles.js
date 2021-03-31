import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'

import { createWebSocketConnection, ws } from 'websocket-connection'
import { userLoggedInSelector, filesSelector } from 'selectors'

export const useGetFiles = () => {
  const history = useHistory()

  const userLoggedIn = useRecoilValue(userLoggedInSelector)
  const [files, setFiles] = useRecoilState(filesSelector)

  useEffect(() => {
    if (!userLoggedIn) history.replace('/')

    const getFiles = async () => {
      if (!ws) await createWebSocketConnection()

      const { files } = await ws.json({ type: 'getFiles' })

      setFiles(files)
    }

    getFiles()
  }, [history, userLoggedIn, setFiles])

  return files
}
