import React, { useState, useEffect } from 'react';
import { Widget } from '@strapi/admin/strapi-admin';
import { getFetchClient } from '@strapi/strapi/admin';
import { PLUGIN_ID } from '../../../pluginId';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useIntl } from 'react-intl';
import { getTranslation } from '../../../utils/getTranslation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface VideoItem {
  videoId: string;
  metrics: { views: number };
  video: { title: string };
}

const Top5VideosWidget: React.FC = () => {
  const { get } = getFetchClient();
  const { formatMessage } = useIntl();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTopVideos = async () => {
      try {
        const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const to = new Date().toISOString();
        const response = await get(`/${PLUGIN_ID}/api-video-asset/getTopVideos`, {
          params: { startDate: from, endDate: to },
        });
        setVideos(response.data as VideoItem[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchTopVideos();
  }, []);

  if (loading) return <Widget.Loading />;
  if (error) return <Widget.Error />;
  if (videos.length === 0) return <Widget.NoData />;

  const data = {
    labels: videos.map((item) => item.video.title),
    datasets: [
      {
        label: formatMessage({
          id: getTranslation('widget.top5videos.views'),
          defaultMessage: 'Views',
        }),
        data: videos.map((item) => item.metrics.views),
        backgroundColor: '#7b79ff',
        borderColor: '#7b79ff',
        borderWidth: 1,
        color: '#ffff',
      },
    ],
  };

  const options: ChartOptions<'bar'> & { plugins: { datalabels: any } } = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    layout: {
      padding: {
        top: 16,
        bottom: 16,
        left: 16,
        right: 16,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { drawOnChartArea: false, color: '#32324d' },
        ticks: { color: '#ffff' },
      },
      y: {
        beginAtZero: true,
        grid: { drawTicks: false, color: '#32324d' },
        ticks: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: formatMessage({
          id: getTranslation('widget.top5videos.title'),
          defaultMessage: 'Top 5 Videos by Views',
        }),
        color: '#ffff',
      },
      datalabels: {
        anchor: 'start' as const,
        align: 'right' as const,
        color: '#ffff',
        formatter: (_value: number, context: any) => context.chart.data.labels[context.dataIndex],
      },
    },
  };

  return <Bar data={data} options={options} color="#ffff" />;
};

export default Top5VideosWidget;
