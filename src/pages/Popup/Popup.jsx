import {
  ArrowForwardIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import {
  ChakraProvider,
  Text,
  Box,
  Input,
  extendTheme,
  HStack,
  IconButton,
  Image,
  Button,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import './Popup.css';
import {
  nsCCAuth,
  validateEpic,
  validatePSN,
  validateXbox,
} from './utils/codes';
import fetchEpic from './utils/epic';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import Data from './Data';
import fetchXbox from './utils/fetchXbox';
import { useEffect } from 'react';
import { BsFillPauseFill } from 'react-icons/bs';
import { disconnectProxy } from './utils/proxy';

const Popup = () => {
  const inputRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [service, setService] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [code, setCode] = React.useState(null);
  const [proxyConnected, setProxyConnected] = React.useState(false);

  const checkCode = async (code) => {
    setLoading(true);
    const results = {
      xbox: validateXbox(code),
      psn: validatePSN(code),
      epic: validateEpic(code),
    };

    const values = Object.values(results);

    if (values.filter((result) => result).length === 1) {
      setCode(code);
      if (results.epic) {
        setService('epic');
        await fetchEpic(code, (data) => {
          setTitle(data.title);
          setImage(data.image);
        });
        setLoading(false);
      }

      if (results.xbox) {
        setService('xbox');
        await fetchXbox(
          code,
          () => setProxyConnected(true),
          (data) => {
            setTitle(data.title);
            setImage(data.image);
          }
        );
        setLoading(false);
      }
    }
    if (values.filter((result) => result).length === 0) {
      setLoading(false);
    }
  };
  console.log(proxyConnected);

  const [time, setTime] = React.useState(null);

  function formatSeconds(seconds) {
    const date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  }

  const proxy = JSON.parse(localStorage.proxy ?? '{}');

  useEffect(() => {
    if (proxy?.connected) {
      setProxyConnected(true);
      const timeConnected = Date.now() - proxy.connectedSince;
      const interval = setInterval(() => {
        setTime(timeConnected);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [time, proxyConnected, proxy]);

  return (
    <ChakraProvider
      theme={extendTheme({
        config: {
          initialColorMode: 'dark',
          useSystemColorMode: false,
        },
        fonts: { heading: `'Inter', sans-serif`, body: `'Inter', sans-serif` },
      })}
    >
      <Box
        h="100vh"
        w="100vw"
        bgColor="#1E1E1E"
        color="white"
        px={4}
        py={7}
        display="flex"
        flexDir="column"
        alignItems="center"
      >
        <HStack>
          <Input
            height={9}
            bgColor="#d9d9d9"
            borderRadius={20}
            color="black"
            fontSize={14}
            ref={inputRef}
          />
          <Button
            borderRadius={20}
            minH={8}
            px={7}
            bg="#4427fd"
            _hover={{
              bg: '#4427fd6a',
            }}
            _active={{
              bg: '#4427fd81',
            }}
            fontSize={14}
            onClick={() => checkCode(inputRef.current.value)}
          >
            Check
          </Button>
        </HStack>
        {proxyConnected && (
          <VStack spacing={0} pt={5}>
            <Text fontSize={20} textAlign="center">
              Connected to {proxy.proxy.name}
            </Text>
            <Text fontSize={32}>{formatSeconds(time / 1000)}</Text>
            <IconButton
              borderRadius="full"
              h={14}
              w={14}
              bg="#4427fd"
              _hover={{
                bg: '#4427fd6a',
              }}
              _active={{
                bg: '#4427fd81',
              }}
              onClick={async () => {
                await disconnectProxy();
                localStorage.removeItem('proxy');
                setProxyConnected(false);
              }}
            >
              <BsFillPauseFill size={34} />
            </IconButton>
          </VStack>
        )}
        {!proxyConnected && !loading ? (
          <Data service={service} title={title} image={image} code={code} />
        ) : (
          !proxyConnected && (
            <VStack spacing={1} pt={8}>
              <Image
                h={8}
                src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
              />
              <Text fontSize={14}>Loading...</Text>
            </VStack>
          )
        )}
      </Box>
    </ChakraProvider>
  );
};

export default Popup;
