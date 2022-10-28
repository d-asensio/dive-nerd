import { DiveList, DiveLogPanel } from '../components'

export const DiveLog = ({ samples }) => {
  return (
    <DiveLogPanel>
      <DiveList>
        <DiveList.Item
          name='Thomas Reef'
          date='25/10/2022 10:30 AM'
          depth='48.2 m'
          time='00:38'
          samples={samples}
        />
        <DiveList.Divider />
        <DiveList.Item
          name='Thomas Reef'
          date='25/10/2022 10:30 AM'
          depth='48.2 m'
          time='00:38'
          samples={samples}
        />
        <DiveList.Divider />
        <DiveList.Item
          name='Thomas Reef'
          date='25/10/2022 10:30 AM'
          depth='48.2 m'
          time='00:38'
          samples={samples}
        />
        <DiveList.Divider />
        <DiveList.Item
          name='Thomas Reef'
          date='25/10/2022 10:30 AM'
          depth='48.2 m'
          time='00:38'
          samples={samples}
        />
        <DiveList.Divider />
        <DiveList.Item
          name='Thomas Reef'
          date='25/10/2022 10:30 AM'
          depth='48.2 m'
          time='00:38'
          samples={samples}
        />
        <DiveList.Divider />
        <DiveList.Item
          name='Thomas Reef'
          date='25/10/2022 10:30 AM'
          depth='48.2 m'
          time='00:38'
          samples={samples}
        />
      </DiveList>
    </DiveLogPanel>
  )
}
