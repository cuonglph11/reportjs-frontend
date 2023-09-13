import { Button, DatePicker, Drawer, Form, Select, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// import * as demooo from '@/utils/jsreportService';

const { Option } = Select;
const { RangePicker } = DatePicker;
/**
 * CONFIG
 */
const ENDPOINTS = {
  GET_REPORT: 'http://localhost:4000/config',
  DOWNLOAD_REPORT: 'http://localhost:5488/api/report',
  SEARCH_REPORT: 'http://localhost:4000/search',
  GET_STATIONS:
    'https://demo-api.ilotusland.asia/station-auto?itemPerPage=Infinity&page=1&isAll=true',
  GET_PARAMS:
    'https://demo-api.ilotusland.asia/measuring/?page=1&itemPerPage=500',
};

// Define a function to fetch options from an API endpoint
async function fetchOptions(apiEndpoint: string): Promise<string[]> {
  try {
    const headers = {
      Authorization:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDE5MGI3ZWZjMzgzMDAwMWJmMTAxNWUiLCJmaXJzdE5hbWUiOiJNaW5oIiwibGFzdE5hbWUiOiLEkOG7lyIsImlzQWRtaW4iOnRydWUsImlzQWN0aXZlIjpmYWxzZSwiaXNPd25lciI6dHJ1ZSwib3JnYW5pemF0aW9uIjp7Il9pZCI6IjVlZWY4MDExOWQ0ZjQ1MDAxMWMzMGQ1OSIsIm5hbWUiOiJpTG90dXNMYW5kIFZpZXQgTmFtIEpTQy4ifSwiaWF0IjoxNjkzMzAwMDA0fQ.mfTmrw4Cro1RxPxt2APciLVQdJxwYViMQfTlFaN4Y28',
    };
    const response = await axios.get(apiEndpoint, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${apiEndpoint}:`, error);
    return [];
  }
}
async function postFetch(
  apiEndpoint: string,
  payload: any,
): Promise<unknown[]> {
  try {
    const headers = {
      Authorization:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDE5MGI3ZWZjMzgzMDAwMWJmMTAxNWUiLCJmaXJzdE5hbWUiOiJNaW5oIiwibGFzdE5hbWUiOiLEkOG7lyIsImlzQWRtaW4iOnRydWUsImlzQWN0aXZlIjpmYWxzZSwiaXNPd25lciI6dHJ1ZSwib3JnYW5pemF0aW9uIjp7Il9pZCI6IjVlZWY4MDExOWQ0ZjQ1MDAxMWMzMGQ1OSIsIm5hbWUiOiJpTG90dXNMYW5kIFZpZXQgTmFtIEpTQy4ifSwiaWF0IjoxNjkzMzAwMDA0fQ.mfTmrw4Cro1RxPxt2APciLVQdJxwYViMQfTlFaN4Y28',
    };
    const response = await axios.post(apiEndpoint, payload, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${apiEndpoint}:`, error);
    return [];
  }
}

// Data transformation function for stations
function transformStations(stationsData: string[]): string[] {
  // console.log(stationsData, 'stationsDatastationsData')
  const { data } = stationsData;
  return data.map((station) => station.key);
}

// Data transformation function for parameters
function transformParameters(parametersData: string[]): string[] {
  console.log(parametersData, 'parametersDataparametersData');
  const { data } = parametersData;
  return data.map((parameter) => parameter.key);
}

// Define a TypeScript interface for the report object
interface Report {
  id: number;
  name: string;
  content: string;
}

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ReportCard = styled.div`
  border: 1px solid #ccc;
  padding: 16px;
  margin: 16px;
  width: calc(33.33% - 32px);
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [stationsOptions, setStationsOptions] = useState<string[]>([]);
  const [parametersOptions, setParametersOptions] = useState<string[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch data from your API
    axios
      .get(ENDPOINTS.GET_REPORT) // Replace with your API endpoint
      .then((response) => {
        const fetchedReports: Report[] = response.data.data; // Assuming the API response is an array of reports
        setReports(fetchedReports);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    async function fetchOptionsData() {
      const stationsData = await fetchOptions(ENDPOINTS.GET_STATIONS);
      const parametersData = await fetchOptions(ENDPOINTS.GET_PARAMS);

      // Apply data transformation
      const transformedStations = transformStations(stationsData);
      // console.log(transformedStations, 'transformedStationstransformedStations')
      const transformedParameters = transformParameters(parametersData);
      // console.log(transformedParameters, 'transformedParameterstransformedParameters')
      setStationsOptions(transformedStations);
      setParametersOptions(transformedParameters);
    }
    fetchOptionsData();
  }, []);

  const openDrawer = (report: Report) => {
    setSelectedReport(report);
  };

  const closeDrawer = () => {
    setSelectedReport(null);
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { dateRange, stations, parameters } = values;
      const [fromDate, toDate] = dateRange;
      const isoFromDate = fromDate.toISOString();
      const isoToDate = toDate.toISOString();

      const payload = {
        configs: {
          name: 'ENVIROMENT MANAGEMENT SYSTEM (EMS) REPORT',
          templatePath: 'Historical Data',
          variables: {
            address: 'Ho Chi Minh',
            companyName: 'iLotusLand',
          },
          data: ['HISTORICAL_DATA', 'HISTORICAL_SUMMARY'],
        },
        filters: {
          stations: [...stations],
          from: isoFromDate,
          to: isoToDate,
          params: [...parameters],
        },
      };

      const response = await axios.post(ENDPOINTS.SEARCH_REPORT, payload, {
        responseType: 'arraybuffer',
      });
      const fileBlob = new Blob([response.data], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(fileBlob);
      window.open(url, '_blank');
    } catch (error) {
      console.log(error);
      // Handle errors here
    } finally {
      setLoading(false); // Set loading to false when the fetch operation is complete
    }
  };

  return (
    <Gallery>
      {reports.map((report) => (
        <ReportCard key={report.id} onClick={() => openDrawer(report)}>
          <h2>{report.name}</h2>
          <p>ID: {report.id}</p>
        </ReportCard>
      ))}

      {selectedReport && (
        <Drawer
          title={`Report: ${selectedReport.name}`}
          width={400}
          onClose={closeDrawer}
          visible={!!selectedReport}
        >
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="stations"
              label="Stations"
              rules={[{ required: true, message: 'Please select stations' }]}
            >
              <Select mode="multiple" placeholder="Select stations">
                {stationsOptions.map((station) => (
                  <Option key={station} value={station}>
                    {station}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Date Range"
              rules={[{ required: true, message: 'Please select date range' }]}
            >
              <RangePicker />
            </Form.Item>

            <Form.Item
              name="parameters"
              label="Parameters"
              rules={[{ required: true, message: 'Please select parameters' }]}
            >
              <Select mode="multiple" placeholder="Select parameters">
                {parametersOptions.map((parameter) => (
                  <Option key={parameter} value={parameter}>
                    {parameter}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Spin spinning={loading} tip="Loading...">
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Spin>
            </Form.Item>
          </Form>
        </Drawer>
      )}
    </Gallery>
  );
};

export default HomePage;
