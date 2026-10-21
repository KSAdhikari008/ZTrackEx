// backend/tests/middleware/auth.test.js
import { describe, test, expect, vi } from 'vitest'
import { authenticate } from '../../src/middleware/auth.js'


describe('authenticate middleware',()=>{

  test('return 401 when auth cookie is missing', async ()=>{
    
    const req = {cookies: {}}
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    const next = vi.fn()

    await authenticate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({message: "User is not logged in."})
    expect(next).not.toHaveBeenCalled()
  })

  tes


})
