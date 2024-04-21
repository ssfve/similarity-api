import ApiDashboard from '@/components/ApiDashboard'
import RequestApiKey from '@/components/RequestApiKey'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Session } from 'next-auth'
import { redis } from '@/middleware'

export const metadata: Metadata = {
  title: 'Similarity API | Dashboard',
  description: 'Free & open-source text similarity API',
}

let session : Session | null = null;

const page = async () => {
  // const user = await getServerSession(authOptions)

  session = await redis.get(`session`);
  if(!session){
    getServerSession(authOptions).then((session) => {
      redis.set(`session`, session);
      // console.log("getAuthSession is", session);
    });
  }
  
  while(!session){
    session = await redis.get(`session`);
  }
  console.log("Navbar session is ", session)

  const user = session?.user;
  if (!user) return notFound()

  const apiKey = await db.apiKey.findFirst({
    where: { userId: user.id, enabled: true },
  })

  return (
    <div className='max-w-7xl mx-auto mt-16'>
      {apiKey ? (
        // @ts-expect-error Server Component
        <ApiDashboard />
      ) : (
        <RequestApiKey />
      )}
    </div>
  )
}

export default page
