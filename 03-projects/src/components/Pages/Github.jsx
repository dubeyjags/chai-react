import React, { useContext, useEffect, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'

const Github = () => {
    const data = useLoaderData()
    console.log('UserContext',UserContext)
    const {user, setUser } = useContext(UserContext)

    useEffect(() => {
        setUser(data)
    }, [data, setUser])

    if (!data) return <div className="text-center py-10 text-[var(--text)]">Loading...</div>

    const joinYear = new Date(data.created_at).getFullYear()

    return (
        <>
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">

                {/* Banner */}
                <div className="h-24 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500" />

                {/* Avatar */}
                <div className="relative px-6 pb-6">
                    <img
                        src={data.avatar_url}
                        alt={data.name}
                        className="w-20 h-20 rounded-full border-4 border-[var(--bg-card)] absolute -top-10"
                    />

                    {/* Actions */}
                    <div className="flex justify-end pt-3 gap-2">
                        <a
                            href={data.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm px-4 py-1.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium transition"
                        >
                            View Profile
                        </a>
                    </div>

                    {/* Name & meta */}
                    <div className="mt-8">
                        <h1 className="text-[var(--text-h)] text-xl font-bold leading-tight">{data.name}</h1>
                        <p className="text-[var(--text)] text-sm">@{data.login}</p>
                    </div>

                    {data.bio && (
                        <p className="mt-3 text-[var(--text)] text-sm">{data.bio}</p>
                    )}

                    {/* Stats row */}
                    <div className="mt-5 grid grid-cols-3 divide-x divide-[var(--border)] bg-[var(--bg)] rounded-xl overflow-hidden text-center">
                        <div className="py-3 px-2">
                            <p className="text-[var(--text-h)] font-bold text-lg">{data.public_repos}</p>
                            <p className="text-[var(--text)] text-xs mt-0.5">Repos</p>
                        </div>
                        <div className="py-3 px-2">
                            <p className="text-[var(--text-h)] font-bold text-lg">{data.followers}</p>
                            <p className="text-[var(--text)] text-xs mt-0.5">Followers</p>
                        </div>
                        <div className="py-3 px-2">
                            <p className="text-[var(--text-h)] font-bold text-lg">{data.following}</p>
                            <p className="text-[var(--text)] text-xs mt-0.5">Following</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="mt-5 space-y-2 text-sm text-[var(--text)]">
                        {data.company && (
                            <div className="flex items-center gap-2">
                                <span>🏢</span><span>{data.company}</span>
                            </div>
                        )}
                        {data.location && (
                            <div className="flex items-center gap-2">
                                <span>📍</span><span>{data.location}</span>
                            </div>
                        )}
                        {data.blog && (
                            <div className="flex items-center gap-2">
                                <span>🔗</span>
                                <a href={data.blog} className="text-[var(--accent)] hover:underline truncate">{data.blog}</a>
                            </div>
                        )}
                        {data.twitter_username && (
                            <div className="flex items-center gap-2">
                                <span>🐦</span><span>@{data.twitter_username}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span>📅</span><span>Joined {joinYear}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Github

export const gitHubInfoLoader = async () => {
    const res = await fetch('https://api.github.com/users/dubeyjags')
    return res.json()
}
