'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Idea, Project, ProjectStatus } from '@/data/content';
import { Badge, Icon } from '@/components/ui';

function SearchBar({ value, onChange, placeholder }: { value:string; onChange:(value:string)=>void; placeholder:string }) {
  return <label className="search-field"><span className="sr-only">Search</span><Icon name="spark" size={16}/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>{value&&<button type="button" aria-label="Clear search" onClick={()=>onChange('')}>×</button>}</label>;
}

export function ProjectExplorer({projects}:{projects:Project[]}) {
  const [query,setQuery]=useState(''); const [status,setStatus]=useState<'ALL'|ProjectStatus>('ALL');
  const results=useMemo(()=>projects.filter(project=>(status==='ALL'||project.status===status)&&(project.title+' '+project.short+' '+project.stack.join(' ')).toLowerCase().includes(query.toLowerCase())),[projects,query,status]);
  const statuses:Array<'ALL'|ProjectStatus>=['ALL','IDEA','RESEARCH','PROTOTYPE','DEVELOPMENT','PILOT','DEPLOYED','MAINTENANCE'];
  return <div><div className="explorer-toolbar"><SearchBar value={query} onChange={setQuery} placeholder="Search projects, technologies, problems…"/><div className="chip-row" aria-label="Filter projects by status">{statuses.map(item=><button type="button" className={'filter-chip '+(status===item?'is-active':'')} key={item} onClick={()=>setStatus(item)}>{item}</button>)}</div></div><div className="explorer-count">{results.length} project{results.length===1?'':'s'} shown</div><div className="cards-grid">{results.map(project=><Link href={'/projects/'+project.slug} className="project-card" key={project.slug}><div className="project-card__top"><span className="mono">PROJECT {project.number}</span><Badge tone={project.status==='IDEA'?'muted':'accent'}>{project.status}</Badge></div><div className="project-card__visual"><span>{project.accent}</span><span className="project-card__grid"/></div><h3>{project.title}</h3><p>{project.short}</p><span className="card-link">Explore project <Icon name="arrow" size={16}/></span></Link>)}</div>{results.length===0&&<div className="empty-state"><strong>No matching projects.</strong><p>Try another search or propose a new project through GitHub Issues.</p></div>}</div>;
}

export function IdeaExplorer({ideas}:{ideas:Idea[]}) {
  const [query,setQuery]=useState(''); const [category,setCategory]=useState<'ALL'|Idea['category']>('ALL');
  const categories:Array<'ALL'|Idea['category']>=['ALL','PROJECT','EVENT','RESEARCH','COMMUNITY'];
  const results=useMemo(()=>ideas.filter(idea=>(category==='ALL'||idea.category===category)&&(idea.title+' '+idea.summary+' '+idea.why+' '+idea.tags.join(' ')).toLowerCase().includes(query.toLowerCase())),[ideas,query,category]);
  return <div><div className="explorer-toolbar"><SearchBar value={query} onChange={setQuery} placeholder="Search project ideas, events, research…"/><div className="chip-row" aria-label="Filter ideas">{categories.map(item=><button type="button" className={'filter-chip '+(category===item?'is-active':'')} key={item} onClick={()=>setCategory(item)}>{item}</button>)}</div></div><div className="explorer-count">{results.length} idea{results.length===1?'':'s'} shown</div><div className="idea-grid">{results.map(idea=><article className="idea-card" key={idea.slug}><div className="project-card__top"><Badge tone="accent">{idea.category}</Badge><span className="mono">{idea.source}</span></div><h3>{idea.title}</h3><p>{idea.summary}</p><div className="idea-card__why"><span className="category">WHY</span><p>{idea.why}</p></div><div className="stack-row">{idea.tags.map(tag=><Badge key={tag}>{tag}</Badge>)}</div><div className="idea-card__footer"><Badge tone="muted">{idea.status}</Badge><a className="card-link" href="https://github.com/acm-bitmesra/acm-bitmesra.github.io/issues/new" target="_blank" rel="noreferrer">Discuss / propose <Icon name="external" size={14}/></a></div></article>)}</div>{results.length===0&&<div className="empty-state"><strong>No matching ideas.</strong><p>Open an issue and suggest the next project or event.</p></div>}</div>;
}

export function LeaderboardPreview(){return <div className="leaderboard-preview"><div className="leaderboard-preview__top"><div><div className="eyebrow">LEADERBOARD</div><h3>Contribution rankings are coming soon.</h3><p>The chapter will publish transparent contribution metrics once the data pipeline and scoring rules are defined.</p></div><Badge tone="accent">COMING SOON</Badge></div><div className="leaderboard-metrics">{['Merged PRs','Issue contributions','Reviews','Project contributions','Docs & content','Event contributions'].map((metric,index)=><div className="leaderboard-metric" key={metric}><span>0{index+1}</span><strong>{metric}</strong><small>Tracking planned</small></div>)}</div><Link href="/open-source" className="btn">See contribution path <Icon name="arrow" size={16}/></Link></div>}
