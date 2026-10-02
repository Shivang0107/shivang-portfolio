export const repairIssues = [
  {
    id: 'heading',
    title: 'Heading baseline',
    detail: 'The letters slipped off their baseline. Bring the offset back to zero.',
    target: '#repair-heading',
  },
  {
    id: 'editor',
    title: 'Code panel transform',
    detail: 'The code panel inherited a rotation. Find its level position.',
    target: '#repair-editor',
  },
  {
    id: 'capabilities',
    title: 'Stack ordering',
    detail: 'The stack reads backwards. Restore the flow: Interfaces, Services, Data, Delivery.',
    target: '#repair-capabilities',
  },
  {
    id: 'projects',
    title: 'Project layout',
    detail: 'The project cards escaped the grid. Put them back into normal grid flow.',
    target: '#repair-projects',
  },
] as const
export type RepairId = (typeof repairIssues)[number]['id']
