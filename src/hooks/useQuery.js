export const useQuery = (proListRef) => {
  // 刷新列表
  const refreshCallback = () => {
    proListRef.value.filter()
  }

  return {
    refreshCallback,
  }
}
