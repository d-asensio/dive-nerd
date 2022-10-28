import { DiveList } from '../components'

export const DiveLog = ({ samples }) => {
  return (
    <DiveList>
      <DiveList.Item
        name='Thomas Reef'
        date='25/10/2022 10:30 AM'
        depth='48.2 m'
        time='00:38'
        rating={4}
        samples={samples}
      />
      <DiveList.Divider />
      <DiveList.Item
        name='Thomas Reef'
        date='25/10/2022 10:30 AM'
        depth='48.2 m'
        time='00:38'
        rating={3}
        samples={samples}
      />
      <DiveList.Divider />
      <DiveList.Item
        name='Thomas Reef'
        date='25/10/2022 10:30 AM'
        depth='48.2 m'
        time='00:38'
        rating={5}
        samples={samples}
      />
      <DiveList.Divider />
      <DiveList.Item
        name='Thomas Reef'
        date='25/10/2022 10:30 AM'
        depth='48.2 m'
        time='00:38'
        rating={3}
        samples={samples}
      />
      <DiveList.Divider />
      <DiveList.Item
        name='Thomas Reef'
        date='25/10/2022 10:30 AM'
        depth='48.2 m'
        time='00:38'
        rating={2}
        samples={samples}
      />
      <DiveList.Divider />
      <DiveList.Item
        name='Thomas Reef'
        date='25/10/2022 10:30 AM'
        depth='48.2 m'
        time='00:38'
        rating={4}
        samples={samples}
      />
    </DiveList>
  )
}
