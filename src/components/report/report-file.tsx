import { PdfIcon } from './pdf-icon';

type IReportFileProps = {
  name: string;
  // onClick: () => void;
};
const ReportFile = (props: IReportFileProps) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 8,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 12,
        display: 'inline-flex',
      }}
    >
      <PdfIcon />
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          color: 'black',
          fontSize: 14,
          fontFamily: 'Inter',
          fontWeight: '400',
        }}
      >
        {props.name}
      </div>
    </div>
  );
};
export { ReportFile };
